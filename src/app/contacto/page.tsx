import sitio from '../../../sitio.config';
import { getServicios } from '@/plataforma/api';
import { FormularioContacto } from '@/plataforma/contacto';
import { enlaceWhatsApp } from '@/plataforma/formato';
import { cap, negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import { Encabezado, Icono, Seccion } from '@/plataforma/ui';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const n = await negocio();
  return meta({ titulo: 'Contacto', descripcion: `Escríbele a ${n.nombre}: WhatsApp, correo y formulario. Te respondemos en horario de atención.`, ruta: '/contacto' });
}

export default async function Contacto({ searchParams }: { searchParams: Promise<{ plan?: string; asunto?: string }> }) {
  const n = await negocio();
  if (!paginas(n).contacto) notFound();
  const sp = await searchParams;
  const asunto = sp.plan ? `Quiero inscribirme al plan «${sp.plan}».` : (sp.asunto ?? null);
  const r = paginas(n).servicios ? await getServicios() : null;
  const servicios = r?.ok ? r.servicios : [];
  const whatsapp = sitio.whatsapp || n.whatsapp;
  const titulo = n.perfil.motor === 'proyectos' ? 'Pide una propuesta' : n.perfil.motor === 'marca' ? 'Para empresas y marcas' : 'Escríbenos';
  return (
    <Seccion>
      <Encabezado eyebrow={n.nombre} titulo={titulo} texto={n.perfil.motor === 'proyectos' ? 'Cuéntanos qué necesitas y te enviamos una propuesta con alcance, tiempos y valor.' : n.perfil.motor === 'marca' ? 'Charlas, talleres, consultorías y colaboraciones: cuéntame qué buscas y para cuándo, y te respondo con una propuesta.' : 'Déjanos tus datos y te respondemos en horario de atención.'} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <FormularioContacto negocio={n} servicios={servicios} asunto={asunto} />
        <aside className="flex flex-col gap-4">
          {whatsapp && (
            <a href={enlaceWhatsApp(whatsapp, sitio.whatsappMensaje)} target="_blank" rel="noopener noreferrer" className="tarjeta flex items-center gap-3 no-underline hover:border-primario">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primario-tenue text-primario">
                <Icono nombre="whatsapp" size={22} />
              </span>
              <span>
                <strong className="block text-tinta">WhatsApp</strong>
                <span className="text-sm text-tinta-2">{whatsapp}</span>
              </span>
            </a>
          )}
          {n.correo && (
            <a href={`mailto:${n.correo}`} className="tarjeta flex items-center gap-3 no-underline hover:border-primario">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primario-tenue text-primario">
                <Icono nombre="enviar" size={20} />
              </span>
              <span>
                <strong className="block text-tinta">Correo</strong>
                <span className="text-sm text-tinta-2">{n.correo}</span>
              </span>
            </a>
          )}
          {(n.sedes.length > 0 || n.direccion) && (
            <div className="tarjeta text-[15px]">
              <strong className="mb-1 block">Dónde estamos</strong>
              {n.sedes.length > 0 ? (
                <ul className="m-0 list-none p-0 text-tinta-2">
                  {n.sedes.map((s) => (
                    <li key={s.id}>
                      {s.nombre}: {[s.direccion, s.ciudad].filter(Boolean).join(', ')}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-tinta-2">
                  {n.direccion}
                  {n.ciudad ? `, ${n.ciudad}` : ''}
                </p>
              )}
              {n.redes.maps && (
                <a href={n.redes.maps} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold">
                  Cómo llegar →
                </a>
              )}
            </div>
          )}
          {n.horario.length > 0 && (
            <div className="tarjeta text-[15px]">
              <strong className="mb-1 block">Horario</strong>
              <ul className="m-0 list-none p-0 text-tinta-2">
                {n.horario.map((h) => (
                  <li key={h.dia}>
                    {cap(h.nombre)}: {h.desde} – {h.hasta}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Seccion>
  );
}
