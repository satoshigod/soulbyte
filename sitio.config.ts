import type { SitioConfig } from '@/plataforma/config';

/**
 * soulbyte.app: el primer sitio sobre la plantilla sitio-cliente, conectado al negocio «Soulbyte» de la
 * plataforma. Las páginas de contenido (portada, canales, servicios, conectar, privacidad) son propias del
 * sitio; reservar, mi cita, contacto, propuesta y el chat vienen de la plataforma.
 */
const sitio: SitioConfig = {
  negocio: 'soulbyte',
  plataforma: 'https://app.soulbyte.app',
  dominio: 'https://soulbyte.app',
  barraFinal: true,
  nombre: 'Soulbyte',
  lema: 'e-commerce y automatización para empresas en Colombia',
  descripcion: 'Tiendas en línea para comercios y automatizaciones para empresas de servicios, con WhatsApp Business, Instagram, Meta y Google. Proveedor de tecnología de Meta.',
  idioma: 'es-CO',
  marca: {
    colorTema: '#06140f',
    logo: '/assets/logo-soulbyte-512.png',
    imagenSocial: '/assets/og-soulbyte.jpg',
  },
  legal: {
    razonSocial: 'Soulbyte S.A.S.',
    nit: '901.923.996-1',
    correo: 'hola@soulbyte.app',
    direccion: 'Carrera 48 # 10-45, C.C. Monterrey, Oficina 2219',
    ciudad: 'Medellín',
    region: 'Antioquia',
  },
  // La cabecera y el pie de soulbyte.app son propios (src/marca): estos menús no se usan.
  menu: [],
  pie: [],
  whatsapp: '',
  whatsappMensaje: 'Hola, quiero información sobre Soulbyte.',
  medicion: {
    metaPixel: '',
    ga4: '',
  },
  paginas: {
    servicios: false,
    reservar: true,
    contacto: true,
    cotizar: false,
    horario: false,
    planes: false,
    espacios: false,
    chat: true,
  },
  inicio: {},
};

export default sitio;
