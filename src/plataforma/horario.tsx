'use client';
import { useEffect, useState } from 'react';
import { enviar, obtener, type Negocio, type Sesion } from './api';
import { cop, fechaLarga, hoy, sumarDias } from './formato';
import { rastrear } from './medicion';
import { cuerpoPersona, DatosPersona, usePersona, validarPersona } from './persona';
import { Aviso, Boton, Cargando, cx, Icono } from './ui';

/** Horario semanal de clases con cupos, y reserva de cupo con los datos de la persona. */
export function HorarioClases({ negocio: n, inicial, sesionInicial }: { negocio: Negocio; inicial: Sesion[]; sesionInicial?: string | null }) {
  const [desde, setDesde] = useState(hoy());
  const [sesiones, setSesiones] = useState<Sesion[]>(inicial);
  const [cargando, setCargando] = useState(false);
  const [elegida, setElegida] = useState<Sesion | null>(inicial.find((s) => s.id === sesionInicial) ?? null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<{ clase: string; conPlan: boolean } | null>(null);
  const { persona, cambiar } = usePersona();

  useEffect(() => {
    if (desde === hoy()) return;
    let activo = true;
    obtener<{ sesiones: Sesion[] }>(`clases?desde=${desde}&dias=7`).then((r) => {
      if (!activo) return;
      setCargando(false);
      if (r.ok) setSesiones(r.sesiones);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [desde]);

  function cambiarSemana(n: number) {
    const nuevo = sumarDias(desde, n);
    setDesde(nuevo);
    setElegida(null);
    if (nuevo === hoy()) setSesiones(inicial);
    else setCargando(true);
  }

  const dias = [...new Set(sesiones.map((s) => s.fecha))].sort();

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!elegida) return;
    const err = validarPersona(persona);
    if (err) return setError(err);
    setEnviando(true);
    setError(null);
    const r = await enviar<{ id: string; conPlan: boolean; clase: string }>('cupos', { ...cuerpoPersona(persona), sesionId: elegida.id });
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setListo({ clase: r.clase, conPlan: r.conPlan });
    rastrear('cupo', { clase: r.clase });
    window.scrollTo({ top: 0 });
  }

  if (listo && elegida) {
    return (
      <div className="tarjeta max-w-[560px] shadow-suave">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-exito-tenue text-exito">
          <Icono nombre="check" size={26} />
        </span>
        <h2 className="!mb-2">Cupo reservado</h2>
        <p className="text-tinta-2">
          {listo.clase} · {fechaLarga(elegida.fecha)}, {elegida.hora}
          <br />
          {listo.conPlan ? 'Se descontó de tu plan.' : `Pagas ${cop(elegida.clase.precio)} al llegar o con tu plan.`}
        </p>
        <Boton href="/horario" variante="secundario" onClick={() => setListo(null)}>
          Volver al horario
        </Boton>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Boton variante="secundario" chico onClick={() => cambiarSemana(-7)} disabled={desde <= hoy()}>
            <Icono nombre="volver" size={16} /> Semana anterior
          </Boton>
          <Boton variante="secundario" chico onClick={() => cambiarSemana(7)}>
            Semana siguiente <Icono nombre="flecha" size={16} />
          </Boton>
          {cargando && <Cargando texto="" />}
        </div>
        {error && !elegida && <Aviso tipo="error">{error}</Aviso>}
        {dias.length === 0 && !cargando && <Aviso>No hay clases programadas esta semana.</Aviso>}
        {dias.map((d) => (
          <section key={d} className="mb-6">
            <h2 className="!mb-2 !text-lg">{fechaLarga(d)}</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {sesiones
                .filter((s) => s.fecha === d)
                .map((s) => {
                  const pasada = new Date(s.inicio) < new Date() || s.estado !== 'scheduled';
                  const llena = s.libres <= 0;
                  return (
                    <button key={s.id} type="button" disabled={pasada || llena || !s.clase.reservaEnLinea} onClick={() => setElegida(s)} className={cx('tarjeta flex items-center gap-3 text-left disabled:opacity-60', elegida?.id === s.id ? 'border-primario bg-primario-tenue' : 'hover:border-primario')}>
                      <span className="w-[86px] flex-none font-display text-[15px] font-semibold">{s.hora}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{s.clase.nombre}</span>
                        <span className="block text-sm text-tinta-3">
                          {[s.instructor, s.clase.nivel].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <span className={cx('flex-none text-sm', llena ? 'text-alerta' : 'text-tinta-2')}>{pasada ? 'Pasó' : llena ? 'Sin cupo' : `${s.libres} cupos`}</span>
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
      <aside className="tarjeta h-fit lg:sticky lg:top-24">
        {elegida ? (
          <form onSubmit={reservar} className="flex flex-col gap-4">
            <div>
              <p className="eyebrow !mb-1">Reservar cupo</p>
              <h2 className="!mb-1 !text-xl">{elegida.clase.nombre}</h2>
              <p className="m-0 text-[15px] text-tinta-2">
                {fechaLarga(elegida.fecha)}, {elegida.hora}
                {elegida.instructor ? ` · ${elegida.instructor}` : ''} · {cop(elegida.clase.precio)}
              </p>
            </div>
            {error && <Aviso tipo="error">{error}</Aviso>}
            <DatosPersona persona={persona} cambiar={cambiar} negocio={n.nombre} politicaDatos={n.politicaDatos} prefijo="h" />
            <Boton type="submit" disabled={enviando}>
              {enviando ? 'Reservando…' : 'Reservar cupo'}
            </Boton>
          </form>
        ) : (
          <p className="m-0 text-tinta-2">Elige una clase del horario para reservar tu cupo. Si tienes plan, se descuenta solo.</p>
        )}
      </aside>
    </div>
  );
}
