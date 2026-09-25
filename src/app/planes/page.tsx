import { notFound } from 'next/navigation';
import { getPlanes } from '@/plataforma/api';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { TarjetaPlan } from '@/plataforma/tarjetas';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  return meta({ titulo: 'Planes', descripcion: `Planes y mensualidades de ${n.nombre}: paquetes de clases, mensualidad ilimitada y cursos.`, ruta: '/planes' });
}

export default async function Planes() {
  const n = await negocio();
  if (!paginas(n).planes) notFound();
  const r = await getPlanes();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo="Planes" texto="Elige el plan que va con tu ritmo. Te escribimos para completar la inscripción y el pago." />
      {!r.ok ? (
        <Aviso tipo="error">{r.error}</Aviso>
      ) : r.planes.length === 0 ? (
        <Aviso>Todavía no hay planes publicados.</Aviso>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {r.planes.map((p) => (
            <TarjetaPlan key={p.id} p={p} />
          ))}
        </div>
      )}
    </Seccion>
  );
}
