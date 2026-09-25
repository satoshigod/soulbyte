import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import sitio from '../../sitio.config';
import { Cabecera } from '@/marca/Cabecera';
import { Pie } from '@/marca/Pie';
import { Sprite } from '@/marca/Sprite';
import { ChatWeb } from '@/plataforma/chat';
import { Medicion } from '@/plataforma/medicion';
import { negocio, paginas } from '@/plataforma/negocio';
import { meta } from '@/plataforma/seo';
import './globals.css';

export const metadata: Metadata = { ...meta({ ruta: '/' }), metadataBase: new URL(sitio.dominio), icons: { icon: [{ url: '/favicon.ico', sizes: '16x16 32x32 48x48' }, { url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' } };
export const viewport: Viewport = { themeColor: sitio.marca.colorTema, width: 'device-width', initialScale: 1 };

// El negocio se lee de la plataforma en cada petición (con caché corta); si no responde, el sitio sigue en pie.
export const dynamic = 'force-dynamic';

// Origen de la visita (primera página y sitio de procedencia), sin cookies: lo usan los formularios de conexión.
const ORIGEN = `try { if (!sessionStorage.getItem('sb_origen')) sessionStorage.setItem('sb_origen', JSON.stringify({ ref: (document.referrer || '').slice(0, 300), entrada: (location.pathname + location.search).slice(0, 300) })); } catch (e) {}`;

export default async function Layout({ children }: { children: ReactNode }) {
  const n = await negocio();
  const pg = paginas(n);
  return (
    <html lang={sitio.idioma}>
      <body>
        <Sprite />
        <Cabecera />
        <main id="contenido">{children}</main>
        <Pie />
        {pg.chat && n.disponible && <ChatWeb negocio={n.nombre} whatsapp={sitio.whatsapp || n.whatsapp} />}
        <Medicion />
        <script dangerouslySetInnerHTML={{ __html: ORIGEN }} />
      </body>
    </html>
  );
}
