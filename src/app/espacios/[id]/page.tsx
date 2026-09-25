import { notFound } from 'next/navigation';
import { getUnidades } from '@/plataforma/api';
import { ReservaEspacio } from '@/plataforma/espacio';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getUnidades();
  const u = r.ok ? r.unidades.find((x) => x.id === id) : null;
  return meta({ titulo: u ? `Reservar ${u.nombre}` : 'Reservar', descripcion: u?.descripcion ?? undefined, ruta: `/espacios/${id}` });
}

export default async function Espacio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await negocio();
  if (!paginas(n).espacios) notFound();
  const r = await getUnidades();
  const u = r.ok ? r.unidades.find((x) => x.id === id) : null;
  if (!u) notFound();
  return (
    <Seccion>
      <Encabezado eyebrow={u.categoria ?? n.nombre} titulo={u.nombre} texto={u.descripcion ?? n.perfil.publico.texto} />
      <ReservaEspacio negocio={n} unidad={u} />
    </Seccion>
  );
}
