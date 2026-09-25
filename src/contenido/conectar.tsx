import { Contenido as ContenidoCliente } from './conectar.cliente';

/** Contenido de /conectar/ (portado del sitio estático el 25-sep-2026). */
export const metadatos = {
  "titulo": "Conectar WhatsApp Business — Soulbyte",
  "descripcion": "Conecta la cuenta de WhatsApp Business de tu comercio a Soulbyte, proveedor de tecnología acreditado por Meta, con el registro guiado de Meta.",
  "ogTitulo": "Conectar WhatsApp Business — Soulbyte",
  "ogDescripcion": "Registro guiado por Meta: eliges o creas tu cuenta de WhatsApp Business, verificas el número y Soulbyte queda autorizado para enviar los mensajes de tus pedidos.",
  "ruta": "/conectar/",
  "noIndex": false
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
        "name": "Conectar WhatsApp Business",
        "item": "https://soulbyte.app/conectar/"
      }
    ]
  }
];

export function Contenido() {
  return <ContenidoCliente />;
}
