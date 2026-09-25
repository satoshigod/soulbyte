'use client';
import Script from 'next/script';
import sitio from '../../sitio.config';

/**
 * Medición: píxel de Meta y Google Analytics 4, solo si están configurados en sitio.config.ts.
 * Las páginas de la plataforma avisan las conversiones con `rastrear()` (reserva, solicitud, cotización…).
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type Evento = 'reserva' | 'solicitud' | 'cotizacion' | 'cupo' | 'alquiler' | 'propuesta_aceptada' | 'cotizacion_aprobada' | 'chat' | 'whatsapp';

const META: Record<Evento, string> = {
  reserva: 'Schedule',
  solicitud: 'Lead',
  cotizacion: 'Lead',
  cupo: 'Schedule',
  alquiler: 'Schedule',
  propuesta_aceptada: 'Purchase',
  cotizacion_aprobada: 'Purchase',
  chat: 'Contact',
  whatsapp: 'Contact',
};

export function rastrear(evento: Evento, datos: Record<string, string | number | null | undefined> = {}) {
  if (typeof window === 'undefined') return;
  const limpio = Object.fromEntries(Object.entries(datos).filter(([, v]) => v !== null && v !== undefined));
  try {
    window.fbq?.('track', META[evento], limpio);
  } catch {
    /* sin píxel */
  }
  try {
    window.gtag?.('event', evento, limpio);
  } catch {
    /* sin analytics */
  }
}

export function Medicion() {
  const { metaPixel, ga4 } = sitio.medicion;
  return (
    <>
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
      {ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`}
          </Script>
        </>
      )}
    </>
  );
}
