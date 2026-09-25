import { notFound } from 'next/navigation';
import { getServicios } from '@/plataforma/api';
import { cap, negocio, paginas } from '@/plataforma/negocio';
import { jsonLdServicios, JsonLd, meta } from '@/plataforma/seo';
import { TarjetaServicio } from '@/plataforma/tarjetas';
import { Aviso, Encabezado, Seccion } from '@/plataforma/ui';

export async function generateMetadata() {
  const n = await negocio();
  const v = n.perfil.vocabulario;
  return meta({ titulo: cap(v.servicio[1]), descripcion: `${cap(v.servicio[1])} de ${n.nombre}: duración, precio y reserva en línea.`, ruta: '/servicios' });
}

export default async function Servicios() {
  const n = await negocio();
  if (!paginas(n).servicios) notFound();
  const v = n.perfil.vocabulario;
  const r = await getServicios();
  const lista = r.ok ? r.servicios : [];
  const categorias = [...new Set(lista.map((s) => s.categoria ?? ''))];
  return (
    <Seccion>
      {lista.length > 0 && <JsonLd datos={jsonLdServicios(n, lista)} />}
      <Encabezado eyebrow={n.nombre} titulo={cap(v.servicio[1])} texto={n.reservasEnLinea && n.perfil.motor !== 'ordenes' ? `Elige el ${v.servicio[0]} y reserva en línea; te confirmamos por correo y WhatsApp.` : `Escríbenos y te contamos cómo trabajamos.`} />
      {!r.ok && <Aviso tipo="error">{r.error}</Aviso>}
      {r.ok && lista.length === 0 && <Aviso>Todavía no hay {v.servicio[1]} publicados.</Aviso>}
      {categorias.map((c) => (
        <div key={c || 'sin'} className="mb-10">
          {c && <h2 className="!mb-4 !text-2xl">{c}</h2>}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lista
              .filter((s) => (s.categoria ?? '') === c)
              .map((s) => (
                <TarjetaServicio key={s.id} s={s} reservar={paginas(n).reservar} motor={n.perfil.motor} />
              ))}
          </div>
        </div>
      ))}
    </Seccion>
  );
}
