import Link from 'next/link';
import type { Plan, Servicio, Unidad } from './api';
import { cop, duracion, horaDeMinutos } from './formato';
import { Icono } from './ui';

/** Tarjetas de catálogo: servicios, planes y unidades. Son de servidor (sin estado). */

export function TarjetaServicio({ s, reservar, motor }: { s: Servicio; reservar: boolean; motor: string }) {
  const datos = [duracion(s.duracionMin), s.lugar].filter(Boolean).join(' · ');
  return (
    <article className="tarjeta flex flex-col gap-2">
      {s.categoria && <p className="eyebrow !mb-0">{s.categoria}</p>}
      <h3 className="!mb-0">{s.nombre}</h3>
      {s.descripcion && <p className="m-0 text-[15px] text-tinta-2">{s.descripcion}</p>}
      <p className="m-0 text-sm text-tinta-3">{datos}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="font-display font-semibold">{cop(s.precio)}</span>
        {reservar && (
          <Link href={`/reservar?servicio=${s.id}`} className="boton boton-primario boton-chico">
            {motor === 'proyectos' ? 'Agendar' : 'Reservar'} <Icono nombre="flecha" size={16} />
          </Link>
        )}
      </div>
      {s.anticipo > 0 && <p className="m-0 text-xs text-tinta-3">Anticipo: {cop(s.anticipo)}</p>}
    </article>
  );
}

const TIPO_PLAN: Record<string, string> = { monthly: 'Mensualidad', pack: 'Paquete', course: 'Curso' };

export function TarjetaPlan({ p }: { p: Plan }) {
  const detalle = [p.clases ? `${p.clases} clases` : 'Clases ilimitadas', p.dias ? `${p.dias} días` : null].filter(Boolean).join(' · ');
  return (
    <article className="tarjeta flex flex-col gap-2">
      <p className="eyebrow !mb-0">{TIPO_PLAN[p.tipo] ?? p.tipo}</p>
      <h3 className="!mb-0">{p.nombre}</h3>
      {p.descripcion && <p className="m-0 text-[15px] text-tinta-2">{p.descripcion}</p>}
      <p className="m-0 text-sm text-tinta-3">{detalle}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="font-display font-semibold">{cop(p.precio)}</span>
        <Link href={`/contacto?plan=${encodeURIComponent(p.nombre)}`} className="boton boton-secundario boton-chico">
          Inscribirme
        </Link>
      </div>
    </article>
  );
}

const UNIDAD_TIEMPO: Record<string, string> = { hour: 'por hora', day: 'por día', night: 'por noche' };

export function TarjetaUnidad({ u }: { u: Unidad }) {
  const horario = u.unidadDeTiempo === 'hour' ? `${horaDeMinutos(u.abreMin)} – ${horaDeMinutos(u.cierraMin)}` : `Entrada ${horaDeMinutos(u.entradaMin)} · salida ${horaDeMinutos(u.salidaMin)}`;
  return (
    <article className="tarjeta flex flex-col gap-2">
      {u.categoria && <p className="eyebrow !mb-0">{u.categoria}</p>}
      <h3 className="!mb-0">{u.nombre}</h3>
      {u.descripcion && <p className="m-0 text-[15px] text-tinta-2">{u.descripcion}</p>}
      <p className="m-0 text-sm text-tinta-3">
        {u.capacidad ? `Hasta ${u.capacidad} personas · ` : ''}
        {horario}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="font-display font-semibold">
          {cop(u.precio)} <small className="font-normal text-tinta-3">{UNIDAD_TIEMPO[u.unidadDeTiempo]}</small>
        </span>
        <Link href={`/espacios/${u.id}`} className="boton boton-primario boton-chico">
          Reservar <Icono nombre="flecha" size={16} />
        </Link>
      </div>
    </article>
  );
}
