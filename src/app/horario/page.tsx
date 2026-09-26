import { notFound } from 'next/navigation';
import { getClases } from '@/plataforma/api';
import { HorarioClases } from '@/plataforma/horario';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  const marca = n.perfil.motor === 'marca';
  return meta({ titulo: marca ? 'Cursos y fechas' : 'Horario de clases', descripcion: marca ? `Cursos, cohortes y masterclass de ${n.nombre} con cupo. Reserva tu cupo en línea.` : `Horario semanal de ${n.nombre} con cupos disponibles. Reserva tu cupo en línea.`, ruta: '/horario' });
}

export default async function Horario({ searchParams }: { searchParams: Promise<{ sesion?: string }> }) {
  const n = await negocio();
  if (!paginas(n).horario) notFound();
  const sp = await searchParams;
  // Marca personal: los cursos y las masterclass tienen fecha, así que se ven cuatro semanas en vez de una.
  const marca = n.perfil.motor === 'marca';
  const r = await getClases(undefined, marca ? 28 : 7);
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={marca ? 'Cursos y próximas fechas' : 'Horario de clases'} texto={marca ? 'Elige la fecha y reserva tu cupo. Si tienes una membresía vigente, se descuenta sola.' : 'Elige tu clase y reserva el cupo. Si tienes un plan activo, se descuenta solo.'} />
      {!r.ok ? <Aviso tipo="error">{r.error}</Aviso> : <HorarioClases negocio={n} inicial={r.sesiones} sesionInicial={sp.sesion ?? null} dias={marca ? 28 : 7} />}
    </Seccion>
  );
}
