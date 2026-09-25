import type { MetadataRoute } from 'next';
import { negocio, paginas } from '@/plataforma/negocio';
import { url } from '@/plataforma/seo';

// Se arma en cada petición con lo que la plataforma tenga publicado.
export const dynamic = 'force-dynamic';

/** Páginas propias de soulbyte.app (conectar/tiktok queda fuera: es noindex hasta que se habilite). */
const PROPIAS: [string, MetadataRoute.Sitemap[number]['changeFrequency'], number][] = [
  ['/', 'weekly', 1],
  ['/whatsapp-business-api/', 'monthly', 0.8],
  ['/ecommerce-b2b-mayoristas/', 'monthly', 0.8],
  ['/google-merchant-center/', 'monthly', 0.8],
  ['/importacion-y-logistica/', 'monthly', 0.8],
  ['/vender-en-colombia/', 'monthly', 0.8],
  ['/automatizacion-empresas-de-servicios/', 'monthly', 0.8],
  ['/conectar/', 'monthly', 0.7],
  ['/privacidad/', 'yearly', 0.2],
];

/** Mapa del sitio: páginas propias más las de la plataforma que aplican (sin las de clave). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const n = await negocio();
  const pg = paginas(n);
  const ahora = new Date();
  const rutas: MetadataRoute.Sitemap = PROPIAS.map(([ruta, changeFrequency, priority]) => ({ url: url(ruta), lastModified: ahora, changeFrequency, priority }));
  if (pg.reservar) rutas.push({ url: url('/reservar/'), lastModified: ahora, changeFrequency: 'weekly', priority: 0.9 });
  if (pg.contacto) rutas.push({ url: url('/contacto/'), lastModified: ahora, changeFrequency: 'monthly', priority: 0.6 });
  return rutas;
}
