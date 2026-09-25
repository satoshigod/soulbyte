import type { MetadataRoute } from 'next';
import { url } from '@/plataforma/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/mi-cita/', '/orden/', '/propuesta/', '/api/'] }],
    sitemap: url('/sitemap.xml'),
  };
}
