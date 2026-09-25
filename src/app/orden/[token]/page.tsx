import { MiOrden } from '@/plataforma/cotizar';
import { negocio } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return meta({ titulo: 'Mi solicitud', ruta: `/orden/${token}`, noIndex: true });
}

export default async function PaginaOrden({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const n = await negocio();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo="Tu solicitud" texto="Aquí ves el estado del trabajo y, cuando esté lista, la cotización para aprobarla." />
      <MiOrden token={token} />
    </Seccion>
  );
}
