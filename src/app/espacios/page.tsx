import { notFound } from 'next/navigation';
import { getUnidades } from '@/plataforma/api';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { TarjetaUnidad } from '@/plataforma/tarjetas';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  return meta({ titulo: 'Espacios y disponibilidad', descripcion: `Reserva en línea los espacios de ${n.nombre}: horarios libres, tarifas y confirmación al instante.`, ruta: '/espacios' });
}

export default async function Espacios() {
  const n = await negocio();
  if (!paginas(n).espacios) notFound();
  const r = await getUnidades();
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={n.perfil.publico.titulo} texto={n.perfil.publico.texto} />
      {!r.ok ? (
        <Aviso tipo="error">{r.error}</Aviso>
      ) : r.unidades.length === 0 ? (
        <Aviso>Todavía no hay espacios publicados.</Aviso>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {r.unidades.map((u) => (
            <TarjetaUnidad key={u.id} u={u} />
          ))}
        </div>
      )}
    </Seccion>
  );
}
