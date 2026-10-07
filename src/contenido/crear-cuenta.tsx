import { FormularioSolicitud } from '@/marca/FormularioSolicitud';
import sitio from '../../sitio.config';

/**
 * Contenido de /crear-cuenta/: las cuentas de la app se crean por invitación, así que aquí el negocio deja sus
 * datos (llegan a Solicitudes del panel de Soulbyte) y, cuando su cuenta queda creada, le llega al correo el
 * enlace de activación. «Iniciar sesión» lleva directo a la app.
 */
export const metadatos = {
  titulo: 'Crear cuenta — Soulbyte',
  descripcion: 'Crea la cuenta de tu negocio en Soulbyte: nos cuentas qué haces, te la preparamos con lo que vas a usar y te llega al correo el enlace para activarla.',
  ogTitulo: 'Crea la cuenta de tu negocio — Soulbyte',
  ogDescripcion: 'Tienda, agenda, WhatsApp Business, Facebook e Instagram: déjanos los datos de tu negocio y te enviamos el enlace para activar tu cuenta.',
  ruta: '/crear-cuenta/',
  noIndex: false,
};

export const jsonld: unknown[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://soulbyte.app/' },
      { '@type': 'ListItem', position: 2, name: 'Crear cuenta', item: 'https://soulbyte.app/crear-cuenta/' },
    ],
  },
];

const ENTRAR = `${sitio.plataforma}/entrar`;
const USOS = ['Tienda en línea', 'Agenda y servicios', 'WhatsApp Business', 'Facebook e Instagram', 'Todavía no lo sé'];

export function Contenido() {
  return (
    <section className="pagina-cabecera">
      <div className="envoltura conectar-grid">
        <div className="conectar-intro">
          <p className="eyebrow">Tu cuenta de Soulbyte</p>
          <h1>Crea la cuenta de tu negocio.</h1>
          <p className="lead">Nos cuentas qué haces y por dónde te escriben tus clientes, te preparamos la cuenta con lo que vas a usar —tienda, agenda, WhatsApp Business, Facebook e Instagram— y te llega al correo el enlace para activarla.</p>
          <p>
            <a className="enlace-flecha" href={ENTRAR}>
              ¿Ya tienes cuenta? Inicia sesión <svg className="ico"><use href="#i-flecha" /></svg>
            </a>
          </p>
        </div>
        <FormularioSolicitud
          id="cuenta"
          titulo="Datos de tu negocio"
          sub="Un minuto aquí y te preparamos la cuenta."
          etiquetaInteres="¿Qué quieres usar primero?"
          intereses={USOS}
          asunto="Quiero crear la cuenta de mi negocio en Soulbyte."
          paraCuenta
          boton="Crear mi cuenta"
          nota="Cuando tu cuenta esté lista, te llega al correo el enlace para activarla."
          exito="Recibimos tus datos. Cuando tu cuenta esté lista, te llega al correo el enlace para activarla; si falta algo, te escribimos por WhatsApp."
          origen="crear-cuenta"
        />
        <div className="conectar-detalle">
          <h2>Cómo se crea tu cuenta</h2>
          <ol className="pasos-lista">
            <li><span><b>Nos cuentas de tu negocio</b>Qué vendes o qué servicios prestas, y por dónde te escriben tus clientes.</span></li>
            <li><span><b>Te preparamos la cuenta</b>Creamos tu negocio en Soulbyte con lo que vas a usar. Si falta algún dato, te escribimos por WhatsApp.</span></li>
            <li><span><b>Activas tu cuenta</b>Te llega al correo un enlace para crear tu contraseña; vence en siete días. Solo tú la conoces: nadie de Soulbyte te la va a pedir.</span></li>
          </ol>
          <h2>Lo que conviene saber</h2>
          <ul className="requisitos">
            <li><svg className="ico"><use href="#i-check-circulo" /></svg><span>Tus clientes, tus pedidos y tus conversaciones siguen siendo de tu negocio.</span></li>
            <li><svg className="ico"><use href="#i-check-circulo" /></svg><span>Tu número de WhatsApp Business lo conectas tú desde <a href="/conectar/">Conectar WhatsApp</a>, con el registro guiado de Meta.</span></li>
            <li><svg className="ico"><use href="#i-check-circulo" /></svg><span>Entras siempre desde «Iniciar sesión», arriba a la derecha, con el correo de tu cuenta.</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
