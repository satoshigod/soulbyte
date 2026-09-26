import type { Metadata } from 'next';
import sitio from '../../sitio.config';
import type { Negocio, Servicio } from './api';
import { cap } from './negocio';

/** Metadatos y datos estructurados (JSON-LD) que comparten todas las páginas. */

export const DOMINIO = sitio.dominio.replace(/\/$/, '');

export function url(ruta = '/'): string {
  let r = ruta.startsWith('/') ? ruta : `/${ruta}`;
  if (sitio.barraFinal && !r.endsWith('/') && !/\.[a-z]+$/.test(r) && !r.includes('#') && !r.includes('?')) r += '/';
  return `${DOMINIO}${r}`;
}

/**
 * Metadatos de una página. `titulo` va sin el nombre del negocio (se agrega solo); `tituloCompleto` se usa tal cual.
 * `ogTitulo` y `ogDescripcion` cambian solo la vista previa al compartir.
 */
export function meta(opts: { titulo?: string; tituloCompleto?: string; descripcion?: string; ogTitulo?: string; ogDescripcion?: string; ruta: string; noIndex?: boolean; imagen?: string }): Metadata {
  const nombre = sitio.nombre;
  const titulo = opts.tituloCompleto ?? (opts.titulo ? `${opts.titulo} — ${nombre}` : `${nombre} — ${sitio.lema}`);
  const descripcion = opts.descripcion ?? sitio.descripcion;
  const canonica = url(opts.ruta);
  const imagen = url(opts.imagen ?? sitio.marca.imagenSocial);
  const ogTitulo = opts.ogTitulo ?? titulo;
  const ogDescripcion = opts.ogDescripcion ?? descripcion;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: canonica },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { type: 'website', locale: 'es_CO', siteName: nombre, title: ogTitulo, description: ogDescripcion, url: canonica, images: [{ url: imagen, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: ogTitulo, description: ogDescripcion, images: [imagen] },
  };
}

const DIA_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Organización o negocio local (una vez, en el layout). */
export function jsonLdNegocio(n: Negocio) {
  const direccion = sitio.legal.direccion || n.direccion;
  const ciudad = sitio.legal.ciudad || n.ciudad;
  const sameAs = Object.values(n.redes).filter(Boolean);
  const marca = n.perfil.motor === 'marca';
  const local = n.perfil.motor !== 'proyectos' && !marca;
  return {
    '@context': 'https://schema.org',
    // Marca personal: la persona es la marca (Person); los demás, negocio local u organización.
    '@type': marca ? 'Person' : local ? 'LocalBusiness' : 'Organization',
    '@id': `${DOMINIO}/#negocio`,
    name: sitio.nombre || n.nombre,
    legalName: marca ? undefined : sitio.legal.razonSocial || undefined,
    url: `${DOMINIO}/`,
    logo: marca ? undefined : { '@type': 'ImageObject', url: url(sitio.marca.logo) },
    image: url(sitio.marca.imagenSocial),
    description: sitio.descripcion,
    jobTitle: marca ? sitio.lema || undefined : undefined,
    email: n.correo ?? sitio.legal.correo,
    telephone: n.telefono ?? n.whatsapp ?? undefined,
    taxID: sitio.legal.nit || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: direccion || ciudad ? { '@type': 'PostalAddress', streetAddress: direccion ?? undefined, addressLocality: ciudad ?? undefined, addressRegion: sitio.legal.region, addressCountry: 'CO' } : undefined,
    areaServed: marca ? undefined : 'CO',
    openingHoursSpecification: local && n.horario.length ? n.horario.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DIA_SCHEMA[h.dia], opens: hm(h.desdeMin), closes: hm(h.hastaMin) })) : undefined,
  };
}

export function jsonLdSitio() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${DOMINIO}/#sitio`, name: sitio.nombre, url: `${DOMINIO}/`, inLanguage: sitio.idioma, publisher: { '@id': `${DOMINIO}/#negocio` } };
}

export function jsonLdServicios(n: Negocio, servicios: Servicio[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cap(n.perfil.vocabulario.servicio[1]),
    itemListElement: servicios.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.nombre,
        description: s.descripcion ?? undefined,
        provider: { '@id': `${DOMINIO}/#negocio` },
        areaServed: 'CO',
        offers: { '@type': 'Offer', price: s.precio, priceCurrency: 'COP', availability: 'https://schema.org/InStock' },
      },
    })),
  };
}

export function jsonLdPreguntas(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({ '@type': 'Question', name: p.pregunta, acceptedAnswer: { '@type': 'Answer', text: p.respuesta } })),
  };
}

export function JsonLd({ datos }: { datos: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, '\\u003c') }} />;
}
