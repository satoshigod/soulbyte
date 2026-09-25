/** Formatos en español de Colombia. Se usan en servidor y navegador. */

export const TZ = 'America/Bogota';

export function cop(n: number | null | undefined): string {
  if (n === null || n === undefined) return '';
  if (n === 0) return 'Sin costo';
  return `$ ${Math.round(n).toLocaleString('es-CO')}`;
}

/** «jueves, 25 de septiembre» */
export function fechaLarga(iso: string | Date, tz = TZ): string {
  const d = typeof iso === 'string' ? new Date(iso.length === 10 ? `${iso}T12:00:00-05:00` : iso) : iso;
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz });
}

/** «jue 25 sep» */
export function fechaCorta(iso: string | Date, tz = TZ): string {
  const d = typeof iso === 'string' ? new Date(iso.length === 10 ? `${iso}T12:00:00-05:00` : iso) : iso;
  return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz }).replace(/\./g, '');
}

/** «9:30 a. m.» */
export function hora(iso: string | Date, tz = TZ): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
}

/** Minutos del día → «6:00 p. m.» */
export function horaDeMinutos(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const sufijo = h < 12 ? 'a. m.' : h === 12 && m === 0 ? 'm.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

/** AAAA-MM-DD de hoy en Colombia. */
export function hoy(tz = TZ): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: tz });
}

export function sumarDias(ymd: string, n: number): string {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function duracion(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Solo dígitos para wa.me; agrega 57 si es un celular colombiano de 10 dígitos. */
export function waDigitos(telefono: string): string {
  const d = telefono.replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('3')) return `57${d}`;
  return d;
}

export function enlaceWhatsApp(telefono: string, mensaje?: string): string {
  const base = `https://wa.me/${waDigitos(telefono)}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** «Llamada de diagnóstico» → «llamada-de-diagnostico» (igual que en la plataforma). */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
