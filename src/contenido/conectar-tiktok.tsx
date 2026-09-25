import { Contenido as ContenidoCliente } from './conectar-tiktok.cliente';

/** Contenido de /conectar/tiktok/ (portado del sitio estático el 25-sep-2026). */
export const metadatos = {
  "titulo": "Conectar TikTok — Soulbyte",
  "descripcion": "Conecta la cuenta de TikTok de tu marca a Soulbyte: publicamos lo que tu equipo programa, respondemos los comentarios con tus reglas y te enviamos las métricas de la cuenta.",
  "ogTitulo": "Conectar TikTok — Soulbyte",
  "ogDescripcion": "Autorizas a Soulbyte desde tu cuenta de TikTok: publicamos lo que tu equipo programa, respondemos los comentarios con tus reglas y te enviamos las métricas de la cuenta.",
  "ruta": "/conectar/tiktok/",
  "noIndex": true
};

export const jsonld: unknown[] = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://soulbyte.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Conectar TikTok",
        "item": "https://soulbyte.app/conectar/tiktok/"
      }
    ]
  }
];

export function Contenido() {
  return <ContenidoCliente />;
}
