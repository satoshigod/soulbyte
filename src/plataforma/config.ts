/**
 * Forma de `sitio.config.ts`: todo lo que cambia de un cliente a otro.
 * Este archivo no se toca por cliente; se edita `sitio.config.ts` en la raíz.
 */

export type EnlaceMenu = { texto: string; href: string };

export type SitioConfig = {
  /** Dirección del negocio en la plataforma (app.soulbyte.app/r/<negocio>). */
  negocio: string;
  /** Dirección de la plataforma. Normalmente https://app.soulbyte.app */
  plataforma: string;
  /** Dominio público del sitio, sin barra final. Se usa en canónicas, sitemap y JSON-LD. */
  dominio: string;
  /** Direcciones con barra final (https://sitio.com/servicios/), como en un sitio estático ya indexado. */
  barraFinal?: boolean;
  /** Nombre comercial (si se deja vacío, se toma el del negocio en la plataforma). */
  nombre: string;
  /** Frase corta para el título de la página de inicio y las redes. */
  lema: string;
  /** Descripción para buscadores (150–160 caracteres). */
  descripcion: string;
  /** Idioma del sitio. */
  idioma: 'es-CO';
  marca: {
    /** Color del tema del navegador (barra del celular). */
    colorTema: string;
    /** Logo cuadrado (mínimo 512×512) en /public. */
    logo: string;
    /** Imagen para compartir en redes (1200×630) en /public. */
    imagenSocial: string;
  };
  legal: {
    razonSocial: string;
    nit?: string;
    correo: string;
    /** Dirección y ciudad; si se dejan vacíos se toman de la plataforma. */
    direccion?: string;
    ciudad?: string;
    /** Región para el JSON-LD (Antioquia, Cundinamarca…). */
    region?: string;
  };
  /** Menú principal. Los enlaces de la plataforma (reservar, contacto…) se agregan solos según el motor. */
  menu: EnlaceMenu[];
  /** Enlaces del pie, por columnas. */
  pie: { titulo: string; enlaces: EnlaceMenu[] }[];
  /** Celular de WhatsApp para el botón flotante (si se deja vacío, se toma el número conectado a la plataforma). */
  whatsapp?: string;
  /** Mensaje inicial del botón de WhatsApp. */
  whatsappMensaje?: string;
  /** Identificadores de medición; vacíos = no se cargan. */
  medicion: {
    metaPixel?: string;
    ga4?: string;
  };
  /** Qué páginas de la plataforma se publican. Las que no aplican al motor del negocio se ocultan solas. */
  paginas: {
    servicios: boolean;
    reservar: boolean;
    contacto: boolean;
    cotizar: boolean;
    horario: boolean;
    planes: boolean;
    espacios: boolean;
    chat: boolean;
  };
  /** Textos de la página de inicio (opcionales: si faltan, salen los del perfil del negocio). */
  inicio: {
    titulo?: string;
    texto?: string;
    /** Bloques «Cómo funciona» (3 pasos). */
    pasos?: { titulo: string; texto: string }[];
    /** Preguntas frecuentes (salen también como JSON-LD FAQPage). */
    preguntas?: { pregunta: string; respuesta: string }[];
  };
};
