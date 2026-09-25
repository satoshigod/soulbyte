import { negocio } from '@/plataforma/negocio';
import { VerPropuesta } from '@/plataforma/propuesta';
import { meta } from '@/plataforma/seo';
import { Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return meta({ titulo: 'Propuesta', ruta: `/propuesta/${token}`, noIndex: true });
}

export default async function PaginaPropuesta({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const n = await negocio();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo="Tu propuesta" texto="Revisa el alcance y el valor; si estás de acuerdo, acéptala aquí y arrancamos." />
      <VerPropuesta negocio={n} token={token} />
    </Seccion>
  );
}
