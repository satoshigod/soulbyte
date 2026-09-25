'use client';
import { useEffect, useState } from 'react';
import { enviar, obtener, type DisponibilidadUnidad, type Negocio, type Unidad } from './api';
import { cop, fechaLarga, horaDeMinutos, hoy, sumarDias } from './formato';
import { rastrear } from './medicion';
import { cuerpoPersona, DatosPersona, usePersona, validarPersona } from './persona';
import { Aviso, Boton, Campo, Cargando, cx, Icono } from './ui';

/** Reserva de una unidad (cancha, salón, cabaña…): por horas, por día o por noche, según la unidad. */
export function ReservaEspacio({ negocio: n, unidad: u }: { negocio: Negocio; unidad: Unidad }) {
  const porHoras = u.unidadDeTiempo === 'hour';
  const [fecha, setFecha] = useState(hoy());
  const [fin, setFin] = useState(sumarDias(hoy(), 1));
  const [disp, setDisp] = useState<DisponibilidadUnidad | null>(null);
  const [inicioMin, setInicioMin] = useState<number | null>(null);
  const [horas, setHoras] = useState(u.minimo);
  const [proposito, setProposito] = useState('');
  const [personas, setPersonas] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<{ codigo: string; valor: number; anticipo: number; estado: string } | null>(null);
  const { persona, cambiar } = usePersona();

  useEffect(() => {
    let activo = true;
    obtener<DisponibilidadUnidad>(`unidades/${u.id}/disponibilidad?fecha=${fecha}`).then((r) => {
      if (!activo) return;
      if (r.ok) setDisp(r);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [u.id, fecha]);

  function cambiarFecha(f: string) {
    setFecha(f);
    setDisp(null);
    setInicioMin(null);
    if (!porHoras && fin <= f) setFin(sumarDias(f, 1));
  }

  const bloque = disp && disp.unidadDeTiempo === 'hour' ? disp.bloques.find((b) => b.inicioMin === inicioMin) : null;
  const maxHoras = bloque?.maxHoras ?? 1;
  const noches = porHoras ? 0 : Math.max(0, Math.round((new Date(`${fin}T12:00:00Z`).getTime() - new Date(`${fecha}T12:00:00Z`).getTime()) / 86_400_000));
  const cantidad = porHoras ? horas : u.unidadDeTiempo === 'night' ? noches : noches + 1;
  const total = u.precio * Math.max(cantidad, 0);
  const ocupada = (d: string) => disp && disp.unidadDeTiempo !== 'hour' && disp.fechasOcupadas.includes(d);

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    const err = validarPersona(persona);
    if (err) return setError(err);
    if (porHoras && inicioMin === null) return setError('Elige la hora de inicio.');
    if (!porHoras && cantidad < u.minimo) return setError(`El mínimo es ${u.minimo} ${u.unidadDeTiempo === 'night' ? 'noches' : 'días'}.`);
    setEnviando(true);
    setError(null);
    const r = await enviar<{ id: string; codigo: string; token: string; valor: number; anticipo: number; estado: string }>('reservas', {
      ...cuerpoPersona(persona),
      unidadId: u.id,
      fecha,
      inicioMin: porHoras ? inicioMin : null,
      horas: porHoras ? horas : null,
      fin: porHoras ? null : fin,
      proposito: proposito.trim() || null,
      personas: personas ? Number(personas) : null,
    });
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setListo(r);
    rastrear('alquiler', { unidad: u.nombre, valor: r.valor });
    window.scrollTo({ top: 0 });
  }

  if (listo) {
    return (
      <div className="tarjeta max-w-[600px] shadow-suave">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-exito-tenue text-exito">
          <Icono nombre="check" size={26} />
        </span>
        <h2 className="!mb-2">{listo.estado === 'confirmed' ? 'Reserva confirmada' : 'Reserva apartada'}</h2>
        <p className="text-tinta-2">
          {u.nombre} · {fechaLarga(fecha)}
          {porHoras && inicioMin !== null ? `, ${horaDeMinutos(inicioMin)} (${horas} h)` : !porHoras ? ` al ${fechaLarga(fin)}` : ''} · código {listo.codigo}
        </p>
        <p className="text-[15px]">
          Valor: <strong>{cop(listo.valor)}</strong>
          {listo.anticipo > 0 ? ` · anticipo ${cop(listo.anticipo)} para confirmar` : ''}
        </p>
        {listo.anticipo > 0 && n.comoPagar && (
          <Aviso>
            <span className="whitespace-pre-line">{n.comoPagar}</span>
          </Aviso>
        )}
        <p className="mt-3 text-sm text-tinta-3">Te enviamos los detalles por WhatsApp{persona.correo ? ' y correo' : ''}.</p>
        <Boton href="/espacios" variante="secundario">
          Ver otros espacios
        </Boton>
      </div>
    );
  }

  return (
    <form onSubmit={reservar} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-5">
        {error && <Aviso tipo="error">{error}</Aviso>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta={porHoras ? 'Fecha' : u.unidadDeTiempo === 'night' ? 'Llegada' : 'Desde'} htmlFor="e-fecha">
            <input id="e-fecha" type="date" className="entrada" min={hoy()} max={sumarDias(hoy(), 60)} value={fecha} onChange={(e) => cambiarFecha(e.target.value)} />
          </Campo>
          {!porHoras && (
            <Campo etiqueta={u.unidadDeTiempo === 'night' ? 'Salida' : 'Hasta'} htmlFor="e-fin">
              <input id="e-fin" type="date" className="entrada" min={fecha} max={sumarDias(hoy(), 61)} value={fin} onChange={(e) => setFin(e.target.value)} />
            </Campo>
          )}
        </div>
        {!disp ? (
          <Cargando texto="Consultando disponibilidad…" />
        ) : disp.unidadDeTiempo === 'hour' ? (
          !disp.abierto ? (
            <Aviso>Ese día no se alquila. Elige otra fecha.</Aviso>
          ) : disp.bloques.length === 0 ? (
            <Aviso>Ese día ya está lleno. Elige otra fecha.</Aviso>
          ) : (
            <>
              <p className="m-0 font-display font-semibold">Hora de inicio</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {disp.bloques.map((b) => (
                  <button
                    key={b.inicioMin}
                    type="button"
                    onClick={() => {
                      setInicioMin(b.inicioMin);
                      setHoras(Math.min(Math.max(u.minimo, horas), b.maxHoras));
                    }}
                    className={cx('tarjeta !p-3 text-center font-display font-semibold hover:border-primario', inicioMin === b.inicioMin && 'border-primario bg-primario-tenue')}
                  >
                    {b.hora}
                  </button>
                ))}
              </div>
              {inicioMin !== null && (
                <Campo etiqueta="¿Cuántas horas?" htmlFor="e-horas" className="max-w-[200px]">
                  <select id="e-horas" className="entrada" value={horas} onChange={(e) => setHoras(Number(e.target.value))}>
                    {Array.from({ length: Math.max(1, maxHoras - u.minimo + 1) }, (_, i) => u.minimo + i).map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? 'hora' : 'horas'}
                      </option>
                    ))}
                  </select>
                </Campo>
              )}
            </>
          )
        ) : ocupada(fecha) ? (
          <Aviso>Esa fecha ya está reservada. Elige otra.</Aviso>
        ) : (
          <Aviso tipo="ok">
            Disponible. Entrada {horaDeMinutos(disp.entradaMin)} y salida {horaDeMinutos(disp.salidaMin)}.
          </Aviso>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="¿Para qué? (opcional)" htmlFor="e-proposito">
            <input id="e-proposito" className="entrada" maxLength={160} value={proposito} onChange={(e) => setProposito(e.target.value)} placeholder="Partido, cumpleaños, reunión…" />
          </Campo>
          <Campo etiqueta="Personas (opcional)" htmlFor="e-personas">
            <input id="e-personas" type="number" min={1} max={500} className="entrada" value={personas} onChange={(e) => setPersonas(e.target.value)} />
          </Campo>
        </div>
        <DatosPersona persona={persona} cambiar={cambiar} negocio={n.nombre} politicaDatos={n.politicaDatos} prefijo="e" />
        <Boton type="submit" disabled={enviando} className="self-start">
          {enviando ? 'Reservando…' : 'Reservar'}
        </Boton>
      </div>
      <aside className="tarjeta h-fit bg-fondo-suave lg:sticky lg:top-24">
        <h2 className="!mb-1 !text-lg">{u.nombre}</h2>
        {u.descripcion && <p className="m-0 text-[15px] text-tinta-2">{u.descripcion}</p>}
        <dl className="mb-0 mt-3 grid gap-2 text-[15px]">
          <div>
            <dt className="text-xs uppercase tracking-wide text-tinta-3">Cuándo</dt>
            <dd className="m-0 font-semibold">
              {fechaLarga(fecha)}
              {porHoras && inicioMin !== null ? `, ${horaDeMinutos(inicioMin)} · ${horas} h` : !porHoras ? ` → ${fechaLarga(fin)}` : ''}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-tinta-3">Valor</dt>
            <dd className="m-0 font-semibold">
              {cop(total)} <small className="font-normal text-tinta-3">({cop(u.precio)} {porHoras ? 'por hora' : u.unidadDeTiempo === 'night' ? 'por noche' : 'por día'})</small>
            </dd>
            {u.anticipo > 0 && <dd className="m-0 text-sm text-tinta-2">Anticipo para confirmar: {cop(u.anticipo)}</dd>}
          </div>
        </dl>
        {n.politicaCancelacion && <p className="mb-0 mt-4 text-xs text-tinta-3">{n.politicaCancelacion}</p>}
      </aside>
    </form>
  );
}
