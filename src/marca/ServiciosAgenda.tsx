import { getServicios, type Servicio } from '@/plataforma/api';
import { duracion, slugify } from '@/plataforma/formato';

/** Lista fija por si la plataforma no responde: la misma que había en el sitio estático. */
const RESPALDO: Pick<Servicio, 'id' | 'nombre' | 'descripcion' | 'duracionMin' | 'lugar'>[] = [
  { id: 'llamada-de-diagnostico', nombre: 'Llamada de diagnóstico', descripcion: 'Videollamada de 30 minutos para entender tu negocio y ver qué conviene automatizar: WhatsApp, tienda en línea, catálogo en Google o procesos internos.', duracionMin: 30, lugar: 'Videollamada' },
  { id: 'demostracion-de-la-plataforma', nombre: 'Demostración de la plataforma', descripcion: 'Te mostramos en vivo la plataforma de Soulbyte: WhatsApp Business, tienda, catálogo en Google y automatizaciones con n8n.', duracionMin: 45, lugar: 'Videollamada' },
];

/**
 * Servicios de la agenda de Soulbyte (sección #agenda de la página de servicios): salen de la plataforma
 * y cada uno lleva a la reserva en este mismo sitio (/reservar/).
 */
export async function ServiciosAgenda() {
  const r = await getServicios();
  const lista = r.ok && r.servicios.length ? r.servicios : RESPALDO;
  return (
    <ul className="servicios-agenda" id="servicios-agenda">
      {lista.map((s) => (
        <li key={s.id} className="servicio-agenda">
          <div>
            <h3>{s.nombre}</h3>
            {s.descripcion && <p>{s.descripcion}</p>}
            <p className="datos-servicio">{[duracion(s.duracionMin).replace(' min', ' minutos'), s.lugar].filter(Boolean).join(' · ')}</p>
          </div>
          <a className="btn btn-primario btn-chico" href={`/reservar/?servicio=${slugify(s.nombre)}`} aria-label={`Reservar: ${s.nombre}`}>
            Reservar
          </a>
        </li>
      ))}
    </ul>
  );
}
