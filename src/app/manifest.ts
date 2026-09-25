import type { MetadataRoute } from 'next';
import sitio from '../../sitio.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sitio.nombre,
    short_name: sitio.nombre.slice(0, 12),
    description: sitio.descripcion,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: sitio.marca.colorTema,
    lang: sitio.idioma,
    icons: [{ src: sitio.marca.logo, sizes: '512x512', type: 'image/png' }],
  };
}
