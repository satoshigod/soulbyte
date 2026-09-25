'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { enviar, obtener, type DiaConHorarios, type Horario, type Negocio, type Servicio } from './api';
import { cop, duracion, fechaCorta, fechaLarga, hora, hoy, slugify } from './formato';
import { rastrear } from './medicion';
import { cuerpoPersona, DatosPersona, usePersona, validarPersona } from './persona';
import { Aviso, Boton, Campo, Cargando, cx, Icono } from './ui';

type Equipo = { id: string; nombre: string; especialidad: string | null };
type Paso = 'servicio' | 'dia' | 'hora' | 'datos' | 'listo';

/** Reserva en línea por pasos: servicio → día → hora → datos → confirmación. Misma disponibilidad que la plataforma. */
export function FlujoReserva({ negocio: n, servicios, equipo, servicioInicial }: { negocio: Negocio; servicios: Servicio[]; equipo: Equipo[]; servicioInicial?: string | null }) {
  const v = n.perfil.vocabulario;
  // ?servicio= acepta el id o el nombre en minúsculas y sin tildes (llamada-de-diagnostico).
  const inicial = servicioInicial ? (servicios.find((s) => s.id === servicioInicial || slugify(s.nombre) === servicioInicial) ?? null) : null;
  const [servicio, setServicio] = useState<Servicio | null>(inicial);
  const [profesional, setProfesional] = useState<string | null>(null);
  const [paso, setPaso] = useState<Paso>(inicial ? 'dia' : 'servicio');
  const [dias, setDias] = useState<DiaConHorarios[] | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<Horario[] | null>(null);
  const [inicio, setInicio] = useState<string | null>(null);
  const [notas, setNotas] = useState('');
  const [mascota, setMascota] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<{ token: string; inicio: string; estado: string; anticipo: number; anticipoEstado: string } | null>(null);
  const { persona, cambiar } = usePersona();

  const pros = useMemo(() => (servicio ? equipo.filter((p) => servicio.profesionales.includes(p.id)) : []), [servicio, equipo]);

  // Días con horarios para el servicio elegido.
  useEffect(() => {
    if (!servicio || paso !== 'dia' || dias) return;
    let activo = true;
    obtener<{ dias: DiaConHorarios[] }>(`dias?servicio=${servicio.id}&desde=${hoy()}&n=${Math.min(n.reservas.diasHaciaAdelante, 28)}${profesional ? `&profesional=${profesional}` : ''}`).then((r) => {
      if (!activo) return;
      if (r.ok) setDias(r.dias);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [servicio, profesional, paso, dias, n.reservas.diasHaciaAdelante]);

  // Horarios del día elegido.
  useEffect(() => {
    if (!servicio || !dia || paso !== 'hora' || horarios) return;
    let activo = true;
    obtener<{ horarios: Horario[] }>(`disponibilidad?servicio=${servicio.id}&fecha=${dia}${profesional ? `&profesional=${profesional}` : ''}`).then((r) => {
      if (!activo) return;
      if (r.ok) setHorarios(r.horarios);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [servicio, dia, profesional, paso, horarios]);

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!servicio || !inicio) return;
    const err = validarPersona(persona);
    if (err) {
      setError(err);
      return;
    }
    setEnviando(true);
    setError(null);
    const notasFinal = [mascota ? `Mascota: ${mascota}` : '', notas].filter(Boolean).join('\n').slice(0, 500) || null;
    const r = await enviar<{ id: string; token: string; inicio: string; estado: string; anticipo: number; anticipoEstado: string }>('citas', { ...cuerpoPersona(persona), servicioId: servicio.id, profesionalId: profesional, inicio, notas: notasFinal });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setListo(r);
    setPaso('listo');
    rastrear('reserva', { servicio: servicio.nombre, valor: servicio.precio });
    window.scrollTo({ top: 0 });
  }

  const pasos: { id: Paso; titulo: string }[] = [
    { id: 'servicio', titulo: cap(v.servicio[0]) },
    { id: 'dia', titulo: 'Día' },
    { id: 'hora', titulo: 'Hora' },
    { id: 'datos', titulo: 'Tus datos' },
  ];
  const indice = pasos.findIndex((p) => p.id === paso);

  if (paso === 'listo' && listo && servicio) {
    const pro = pros.find((p) => p.id === profesional);
    return (
      <div className="tarjeta max-w-[620px] shadow-suave">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-exito-tenue text-exito">
          <Icono nombre="check" size={26} />
        </span>
        <h2 className="!mb-2">{listo.estado === 'pending' ? 'Reserva apartada' : `${cap(v.cita[0])} confirmada`}</h2>
        <p className="lead !text-base">
          {servicio.nombre}
          {pro ? ` con ${pro.nombre}` : ''} · {fechaLarga(listo.inicio, n.zonaHoraria)}, {hora(listo.inicio, n.zonaHoraria)}
        </p>
        {listo.anticipo > 0 && listo.anticipoEstado !== 'paid' ? (
          <Aviso>
            Para confirmar, paga el anticipo de <strong>{cop(listo.anticipo)}</strong> dentro de los próximos {n.reservas.retencionAnticipoMin} minutos.
            {n.comoPagar ? <span className="mt-1 block whitespace-pre-line">{n.comoPagar}</span> : null}
          </Aviso>
        ) : (
          <p className="text-tinta-2">{persona.correo ? 'Te enviamos la confirmación al correo y al WhatsApp.' : 'Te enviamos la confirmación por WhatsApp.'}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Boton href={`/mi-cita/${listo.token}`}>Ver mi {v.cita[0]}</Boton>
          <Boton href="/" variante="secundario">
            Volver al inicio
          </Boton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <ol className="mb-6 flex list-none flex-wrap items-center gap-2 p-0" aria-label="Pasos de la reserva">
          {pasos.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2" aria-current={p.id === paso ? 'step' : undefined}>
              <button
                type="button"
                disabled={i >= indice}
                onClick={() => setPaso(p.id)}
                className={cx('flex items-center gap-1.5 text-[14px] font-medium', p.id === paso ? 'text-tinta' : i < indice ? 'text-primario' : 'text-tinta-3')}
              >
                <span className={cx('inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold', p.id === paso ? 'bg-primario text-white' : i < indice ? 'bg-primario-tenue text-primario' : 'bg-fondo-suave text-tinta-3')}>{i < indice ? <Icono nombre="check" size={13} /> : i + 1}</span>
                {p.titulo}
              </button>
              {i < pasos.length - 1 && <span aria-hidden="true" className="h-px w-5 bg-linea-fuerte" />}
            </li>
          ))}
        </ol>

        {error && (
          <div className="mb-4">
            <Aviso tipo="error">{error}</Aviso>
          </div>
        )}

        {paso === 'servicio' && (
          <div className="grid gap-3 md:grid-cols-2">
            {servicios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setServicio(s);
                  setProfesional(null);
                  setDia(null);
                  setInicio(null);
                  setDias(null);
                  setHorarios(null);
                  setError(null);
                  setPaso('dia');
                }}
                className="tarjeta flex flex-col items-start gap-1 text-left hover:border-primario"
              >
                {s.categoria && <span className="eyebrow !mb-0">{s.categoria}</span>}
                <span className="font-display font-semibold">{s.nombre}</span>
                <span className="text-sm text-tinta-3">
                  {duracion(s.duracionMin)}
                  {s.lugar ? ` · ${s.lugar}` : ''} · {cop(s.precio)}
                </span>
              </button>
            ))}
          </div>
        )}

        {paso === 'dia' && servicio && (
          <>
            {pros.length > 1 && (
              <Campo etiqueta={`¿Con quién? (${v.profesional[0]})`} htmlFor="profesional" className="mb-5 max-w-sm">
                <select
                  id="profesional"
                  className="entrada"
                  value={profesional ?? ''}
                  onChange={(e) => {
                    setProfesional(e.target.value || null);
                    setDias(null);
                    setHorarios(null);
                  }}
                >
                  <option value="">Cualquiera</option>
                  {pros.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                      {p.especialidad ? ` · ${p.especialidad}` : ''}
                    </option>
                  ))}
                </select>
              </Campo>
            )}
            {!dias ? (
              <Cargando texto="Buscando días con horario…" />
            ) : dias.filter((d) => d.horarios > 0).length === 0 ? (
              <Aviso>No hay horarios libres en los próximos días. Escríbenos y buscamos uno.</Aviso>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {dias
                  .filter((d) => d.horarios > 0)
                  .map((d) => (
                    <button
                      key={d.fecha}
                      type="button"
                      onClick={() => {
                        setDia(d.fecha);
                        setInicio(null);
                        setHorarios(null);
                        setError(null);
                        setPaso('hora');
                      }}
                      className="tarjeta !p-3 text-center hover:border-primario"
                    >
                      <span className="block font-display font-semibold">{fechaCorta(d.fecha)}</span>
                      <span className="text-xs text-tinta-3">{d.horarios} horarios</span>
                    </button>
                  ))}
              </div>
            )}
          </>
        )}

        {paso === 'hora' && servicio && dia && (
          <>
            <p className="mb-3 font-display font-semibold">{fechaLarga(dia)}</p>
            {!horarios ? (
              <Cargando texto="Buscando horarios…" />
            ) : horarios.length === 0 ? (
              <Aviso>Ese día ya se llenó. Elige otro.</Aviso>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {horarios.map((h) => (
                  <button
                    key={h.inicio}
                    type="button"
                    onClick={() => {
                      setInicio(h.inicio);
                      if (!profesional && h.profesionales.length === 1 && pros.length > 1) setProfesional(h.profesionales[0]);
                      setPaso('datos');
                    }}
                    className={cx('tarjeta !p-3 text-center font-display font-semibold hover:border-primario', inicio === h.inicio && 'border-primario bg-primario-tenue')}
                  >
                    {h.hora}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {paso === 'datos' && servicio && inicio && (
          <form onSubmit={reservar} className="flex flex-col gap-5">
            <DatosPersona persona={persona} cambiar={cambiar} negocio={n.nombre} politicaDatos={n.politicaDatos} conEmpresa={n.perfil.rasgos.includes('empresa')} prefijo="r" />
            {n.perfil.rasgos.includes('mascotas') && (
              <Campo etiqueta="Nombre de tu mascota" htmlFor="r-mascota" className="max-w-sm">
                <input id="r-mascota" className="entrada" maxLength={60} value={mascota} onChange={(e) => setMascota(e.target.value)} />
              </Campo>
            )}
            <Campo etiqueta="Notas (opcional)" htmlFor="r-notas">
              <textarea id="r-notas" className="entrada" rows={2} maxLength={400} value={notas} onChange={(e) => setNotas(e.target.value)} />
            </Campo>
            <div className="flex flex-wrap gap-3">
              <Boton type="submit" disabled={enviando}>
                {enviando ? 'Reservando…' : `Confirmar ${v.cita[0]}`}
              </Boton>
              <Boton variante="secundario" onClick={() => setPaso('hora')}>
                Cambiar la hora
              </Boton>
            </div>
          </form>
        )}
      </div>

      <aside className="tarjeta h-fit bg-fondo-suave lg:sticky lg:top-24">
        <h2 className="!mb-3 !text-lg">Tu {v.cita[0]}</h2>
        <dl className="m-0 grid gap-2 text-[15px]">
          <div>
            <dt className="text-xs uppercase tracking-wide text-tinta-3">{cap(v.servicio[0])}</dt>
            <dd className="m-0 font-semibold">{servicio?.nombre ?? '—'}</dd>
            {servicio && (
              <dd className="m-0 text-sm text-tinta-2">
                {duracion(servicio.duracionMin)} · {cop(servicio.precio)}
                {servicio.anticipo > 0 ? ` · anticipo ${cop(servicio.anticipo)}` : ''}
              </dd>
            )}
          </div>
          {pros.length > 0 && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-tinta-3">{cap(v.profesional[0])}</dt>
              <dd className="m-0 font-semibold">{pros.find((p) => p.id === profesional)?.nombre ?? (pros.length === 1 ? pros[0].nombre : 'Cualquiera')}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-tinta-3">Cuándo</dt>
            <dd className="m-0 font-semibold">{inicio ? `${fechaLarga(inicio, n.zonaHoraria)}, ${hora(inicio, n.zonaHoraria)}` : dia ? fechaLarga(dia) : '—'}</dd>
          </div>
        </dl>
        {n.politicaCancelacion && <p className="mb-0 mt-4 text-xs text-tinta-3">{n.politicaCancelacion}</p>}
        <p className="mb-0 mt-3 text-xs text-tinta-3">
          ¿Ya tienes una reserva? Ábrela desde el enlace de tu confirmación o{' '}
          <Link href="/contacto">escríbenos</Link>.
        </p>
      </aside>
    </div>
  );
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
