import { notFound } from 'next/navigation';
import { getClases } from '@/plataforma/api';
import { HorarioClases } from '@/plataforma/horario';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  return meta({ titulo: 'Horario de clases', descripcion: `Horario semanal de ${n.nombre} con cupos disponibles. Reserva tu cupo en línea.`, ruta: '/horario' });
}

export default async function Horario({ searchParams }: { searchParams: Promise<{ sesion?: string }> }) {
  const n = await negocio();
  if (!paginas(n).horario) notFound();
  const sp = await searchParams;
  const r = await getClases(undefined, 7);
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo="Horario de clases" texto="Elige tu clase y reserva el cupo. Si tienes un plan activo, se descuenta solo." />
      {!r.ok ? <Aviso tipo="error">{r.error}</Aviso> : <HorarioClases negocio={n} inicial={r.sesiones} sesionInicial={sp.sesion ?? null} />}
    </Seccion>
  );
}
