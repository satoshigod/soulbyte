import sitio from '../../sitio.config';

/**
 * Cliente de la API pública de la plataforma (app.soulbyte.app/api/publico/<negocio>/…).
 * Sirve en el servidor (páginas) y en el navegador (formularios y chat). Solo datos públicos.
 */

// Para probar en local contra una plataforma de desarrollo: NEXT_PUBLIC_PLATAFORMA=http://localhost:3100 NEXT_PUBLIC_NEGOCIO=muestra-taller npm run dev
const PLATAFORMA = (process.env.NEXT_PUBLIC_PLATAFORMA || sitio.plataforma).replace(/\/$/, '');
export const NEGOCIO = process.env.NEXT_PUBLIC_NEGOCIO || sitio.negocio;
export const API = `${PLATAFORMA}/api/publico/${NEGOCIO}`;

export type Motor = 'citas' | 'proyectos' | 'ordenes' | 'clases' | 'alquiler';

export type Vocabulario = {
  cliente: [string, string];
  profesional: [string, string];
  cita: [string, string];
  trabajo: [string, string];
  servicio: [string, string];
  hito: [string, string];
  agenda: string;
  trabajoMenu: string;
};

export type Negocio = {
  nombre: string;
  slug: string;
  rubro: string | null;
  perfil: { id: string; nombre: string; motor: Motor; grupo: string; vocabulario: Vocabulario; rasgos: string[]; publico: { titulo: string; texto: string } };
  direccion: string | null;
  ciudad: string | null;
  telefono: string | null;
  whatsapp: string | null;
  whatsappConectado: boolean;
  correo: string | null;
  zonaHoraria: string;
  reservasEnLinea: boolean;
  sitioWeb: string | null;
  redes: { instagram?: string; facebook?: string; tiktok?: string; youtube?: string; x?: string; maps?: string };
  politicaDatos: string | null;
  politicaCancelacion: string | null;
  comoPagar: string | null;
  reservas: { anticipacionMin: number; diasHaciaAdelante: number; retencionAnticipoMin: number };
  formularioPrevio: boolean;
  sedes: { id: string; nombre: string; direccion: string | null; ciudad: string | null }[];
  equipo: { id: string; nombre: string; especialidad: string | null }[];
  horario: { dia: number; nombre: string; desde: string; hasta: string; desdeMin: number; hastaMin: number }[];
  demostracion: boolean;
  paginaPublica: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  duracionMin: number;
  lugar: string | null;
  precio: number;
  anticipo: number;
  profesionales: string[];
};

export type Horario = { inicio: string; hora: string; profesionales: string[] };
export type DiaConHorarios = { fecha: string; horarios: number };

export type Cita = {
  id: string;
  servicio: string;
  profesional: string | null;
  inicio: string;
  fin: string;
  estado: 'pending' | 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'no_show' | 'cancelled';
  valor: number;
  anticipo: number;
  anticipoEstado: string;
  anticipoVence: string | null;
  cliente: string;
  formularioPendiente: boolean;
  preguntas: string[];
  encuestaRespondida: boolean;
  encuestaDisponible: boolean;
  puedeCancelar: boolean;
  politicaCancelacion: string | null;
  comoPagar: string | null;
};

export type Orden = {
  codigo: string;
  servicio: string;
  etapa: string;
  descripcion: string | null;
  cotizacion: { manoDeObra: number; materiales: { nombre: string; cantidad: number; valor: number }[]; total: number; estado: string; nota: string | null; abierta: boolean } | null;
  entregaPrometida: string | null;
  garantiaHasta: string | null;
  cliente: string;
  vocabulario: Vocabulario;
};

export type Propuesta = {
  codigo: string;
  titulo: string;
  descripcion: string | null;
  items: { label: string; qty: number; price: number }[];
  total: number;
  vigenteHasta: string | null;
  estado: 'sent' | 'accepted' | 'rejected' | 'expired' | string;
  abierta: boolean;
  cliente: string;
  empresa: string | null;
  negocio: string;
};

export type Sesion = {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  hora: string;
  clase: { id: string; nombre: string; categoria: string | null; nivel: string | null; descripcion: string | null; precio: number; reservaEnLinea: boolean };
  instructor: string | null;
  cupo: number;
  libres: number;
  estado: 'scheduled' | 'done' | 'cancelled';
};

export type Plan = { id: string; nombre: string; tipo: 'monthly' | 'pack' | 'course' | string; descripcion: string | null; precio: number; dias: number | null; clases: number | null };

export type Unidad = {
  id: string;
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  capacidad: number | null;
  unidadDeTiempo: 'hour' | 'day' | 'night';
  precio: number;
  anticipo: number;
  minimo: number;
  abreMin: number;
  cierraMin: number;
  dias: number[];
  entradaMin: number;
  salidaMin: number;
};

export type DisponibilidadUnidad =
  | { unidadDeTiempo: 'hour'; fecha: string; abierto: boolean; bloques: { inicioMin: number; hora: string; maxHoras: number }[]; precioPorHora: number; minimo: number }
  | { unidadDeTiempo: 'day' | 'night'; desde: string; fechasOcupadas: string[]; dias: number[]; precio: number; anticipo: number; minimo: number; entradaMin: number; salidaMin: number };

export type MensajeChat = {
  id: string;
  de: 'visitante' | 'equipo' | 'asistente';
  texto: string | null;
  encabezado: string | null;
  pie: string | null;
  opciones: { id: string; titulo: string; descripcion: string | null }[];
  tipo: string;
  en: string;
};

export type Fallo = { ok: false; error: string };
export type Respuesta<T> = ({ ok: true } & T) | Fallo;

async function leer<T>(res: Response): Promise<Respuesta<T>> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: 'La plataforma no respondió. Intenta de nuevo.' };
  }
  const r = data as { ok?: boolean; error?: string };
  if (!r || typeof r !== 'object') return { ok: false, error: 'Respuesta inesperada de la plataforma.' };
  if (r.ok === false) return { ok: false, error: r.error || 'No se pudo completar. Intenta de nuevo.' };
  return data as Respuesta<T>;
}

/** GET desde el servidor, con caché de Next (segundos). En el navegador, sin caché. */
export async function obtener<T>(ruta: string, segundos = 60): Promise<Respuesta<T>> {
  try {
    const res = await fetch(`${API}/${ruta}`, typeof window === 'undefined' ? { next: { revalidate: segundos } } : { cache: 'no-store' });
    return await leer<T>(res);
  } catch {
    return { ok: false, error: 'No hay conexión con la plataforma.' };
  }
}

/** POST con JSON (formularios, reservas, chat). */
export async function enviar<T>(ruta: string, cuerpo: unknown): Promise<Respuesta<T>> {
  try {
    const res = await fetch(`${API}/${ruta}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo), cache: 'no-store' });
    return await leer<T>(res);
  } catch {
    return { ok: false, error: 'No hay conexión con la plataforma. Revisa tu internet e intenta de nuevo.' };
  }
}

// ---------------------------------------------------------------- lecturas de servidor (páginas)
export const getNegocio = () => obtener<{ negocio: Negocio }>('negocio', 300);
export const getServicios = () => obtener<{ reservasEnLinea: boolean; servicios: Servicio[]; equipo: { id: string; nombre: string; especialidad: string | null }[] }>('servicios', 120);
export const getClases = (desde?: string, dias = 7) => obtener<{ desde: string; dias: number; sesiones: Sesion[] }>(`clases?dias=${dias}${desde ? `&desde=${desde}` : ''}`, 60);
export const getPlanes = () => obtener<{ planes: Plan[] }>('planes', 300);
export const getUnidades = () => obtener<{ unidades: Unidad[] }>('unidades', 300);
