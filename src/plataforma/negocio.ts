import sitio from '../../sitio.config';
import { getNegocio, NEGOCIO, type Motor, type Negocio } from './api';

/**
 * El negocio según la plataforma, con lo que el sitio necesita para decidir qué páginas mostrar.
 * Si la plataforma no responde, el sitio sigue sirviendo con datos mínimos de `sitio.config.ts`.
 */

export type NegocioSitio = Negocio & { disponible: boolean };

const RESPALDO: Negocio = {
  nombre: sitio.nombre,
  slug: NEGOCIO,
  rubro: null,
  perfil: {
    id: 'servicios',
    nombre: 'Servicios',
    motor: 'citas',
    grupo: 'General',
    vocabulario: { cliente: ['cliente', 'clientes'], profesional: ['profesional', 'profesionales'], cita: ['cita', 'citas'], trabajo: ['servicio', 'servicios'], servicio: ['servicio', 'servicios'], hito: ['paso', 'pasos'], agenda: 'Agenda', trabajoMenu: 'Servicios' },
    rasgos: [],
    publico: { titulo: 'Reserva tu cita', texto: 'Elige el servicio y el horario que prefieras.' },
  },
  direccion: sitio.legal.direccion ?? null,
  ciudad: sitio.legal.ciudad ?? null,
  telefono: null,
  whatsapp: sitio.whatsapp || null,
  whatsappConectado: false,
  correo: sitio.legal.correo,
  zonaHoraria: 'America/Bogota',
  reservasEnLinea: false,
  sitioWeb: sitio.dominio,
  redes: {},
  politicaDatos: null,
  politicaCancelacion: null,
  comoPagar: null,
  reservas: { anticipacionMin: 120, diasHaciaAdelante: 45, retencionAnticipoMin: 30 },
  formularioPrevio: false,
  sedes: [],
  equipo: [],
  horario: [],
  demostracion: false,
  paginaPublica: `${sitio.plataforma}/r/${NEGOCIO}`,
};

export async function negocio(): Promise<NegocioSitio> {
  const r = await getNegocio();
  if (!r.ok) return { ...RESPALDO, disponible: false };
  // El nombre comercial sale de sitio.config.ts; con NEXT_PUBLIC_NEGOCIO (pruebas) manda el de la plataforma.
  return { ...r.negocio, nombre: (NEGOCIO === sitio.negocio && sitio.nombre) || r.negocio.nombre, disponible: true };
}

export const tieneRasgo = (n: Negocio, rasgo: string) => n.perfil.rasgos.includes(rasgo);

/** Páginas de la plataforma que aplican a este negocio: motor + `paginas` de la configuración. */
export function paginas(n: Negocio) {
  const m = n.perfil.motor;
  const p = sitio.paginas;
  return {
    servicios: p.servicios && (m === 'citas' || m === 'proyectos' || m === 'ordenes'),
    reservar: p.reservar && (m === 'citas' || m === 'proyectos') && n.reservasEnLinea,
    contacto: p.contacto,
    cotizar: p.cotizar && m === 'ordenes',
    horario: p.horario && m === 'clases',
    planes: p.planes && m === 'clases',
    espacios: p.espacios && m === 'alquiler',
    chat: p.chat,
  };
}

/** Enlace principal («llamado a la acción») según el motor. */
export function accionPrincipal(n: Negocio): { texto: string; href: string } {
  const v = n.perfil.vocabulario;
  const pg = paginas(n);
  switch (n.perfil.motor) {
    case 'citas':
      return pg.reservar ? { texto: `Reservar ${v.cita[0]}`, href: '/reservar' } : { texto: 'Escríbenos', href: '/contacto' };
    case 'proyectos':
      return { texto: 'Pedir una propuesta', href: '/contacto' };
    case 'ordenes':
      return pg.cotizar ? { texto: 'Pedir cotización o visita', href: '/cotizar' } : { texto: 'Escríbenos', href: '/contacto' };
    case 'clases':
      return pg.horario ? { texto: 'Ver horario', href: '/horario' } : { texto: 'Inscribirme', href: '/contacto' };
    case 'alquiler':
      return pg.espacios ? { texto: 'Ver disponibilidad', href: '/espacios' } : { texto: 'Reservar', href: '/contacto' };
  }
}

/** Enlaces de la plataforma para el menú, según lo que aplica. */
export function enlacesPlataforma(n: Negocio): { texto: string; href: string }[] {
  const v = n.perfil.vocabulario;
  const pg = paginas(n);
  const out: { texto: string; href: string }[] = [];
  if (pg.servicios) out.push({ texto: cap(v.servicio[1]), href: '/servicios' });
  if (pg.reservar) out.push({ texto: n.perfil.motor === 'proyectos' ? 'Agendar reunión' : `Reservar`, href: '/reservar' });
  if (pg.cotizar) out.push({ texto: 'Cotizar', href: '/cotizar' });
  if (pg.horario) out.push({ texto: 'Horario', href: '/horario' });
  if (pg.planes) out.push({ texto: 'Planes', href: '/planes' });
  if (pg.espacios) out.push({ texto: 'Espacios', href: '/espacios' });
  if (pg.contacto) out.push({ texto: 'Contacto', href: '/contacto' });
  return out;
}

export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export function esMotor(n: Negocio, ...m: Motor[]) {
  return m.includes(n.perfil.motor);
}
