import { notFound } from 'next/navigation';
import { getServicios } from '@/plataforma/api';
import { FormularioCotizacion } from '@/plataforma/cotizar';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  return meta({ titulo: 'Pedir cotización o visita', descripcion: `Cuéntale a ${n.nombre} qué necesitas y recibe la cotización o la fecha de la visita por WhatsApp.`, ruta: '/cotizar' });
}

export default async function Cotizar() {
  const n = await negocio();
  if (!paginas(n).cotizar) notFound();
  const r = await getServicios();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={n.perfil.publico.titulo} texto={n.perfil.publico.texto} />
      <FormularioCotizacion negocio={n} servicios={r.ok ? r.servicios : []} />
    </Seccion>
  );
}
