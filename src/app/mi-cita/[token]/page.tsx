import { MiCita } from '@/plataforma/mi-cita';
import { negocio } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const n = await negocio();
  return meta({ titulo: `Mi ${n.perfil.vocabulario.cita[0]}`, ruta: `/mi-cita/${token}`, noIndex: true });
}

export default async function PaginaMiCita({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const n = await negocio();
  const v = n.perfil.vocabulario;
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={`Tu ${v.cita[0]}`} texto={`Aquí puedes ver los detalles, responder el formulario previo y cancelar si lo necesitas.`} />
      <MiCita negocio={n} token={token} />
    </Seccion>
  );
}
