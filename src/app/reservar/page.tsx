import { notFound } from 'next/navigation';
import { getServicios } from '@/plataforma/api';
import { negocio, paginas } from '@/plataforma/negocio';
import { FlujoReserva } from '@/plataforma/reservar';
import { meta } from '@/plataforma/seo';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  const v = n.perfil.vocabulario;
  return meta({ titulo: n.perfil.motor === 'proyectos' ? 'Agendar una reunión' : `Reservar ${v.cita[0]}`, descripcion: `Reserva en línea en ${n.nombre}: elige el ${v.servicio[0]}, el día y la hora, y recibe la confirmación al instante.`, ruta: '/reservar' });
}

export default async function Reservar({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const n = await negocio();
  if (!paginas(n).reservar) notFound();
  const v = n.perfil.vocabulario;
  const sp = await searchParams;
  const r = await getServicios();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={n.perfil.motor === 'proyectos' ? 'Agenda una reunión' : n.perfil.publico.titulo} texto={n.perfil.publico.texto} />
      {!r.ok ? <Aviso tipo="error">{r.error}</Aviso> : r.servicios.length === 0 ? <Aviso>Todavía no hay {v.servicio[1]} para reservar en línea. Escríbenos.</Aviso> : <FlujoReserva negocio={n} servicios={r.servicios} equipo={r.equipo} servicioInicial={sp.servicio ?? null} />}
    </Seccion>
  );
}
