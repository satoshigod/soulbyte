/** Contenido de /404 (portado del sitio estático el 25-sep-2026). */
export const metadatos = {
  "titulo": "Página no encontrada — Soulbyte",
  "descripcion": "",
  "ogTitulo": "Página no encontrada — Soulbyte",
  "ogDescripcion": "",
  "ruta": "/404",
  "noIndex": true
};

export const jsonld: unknown[] = [];

export function Contenido() {
  return (
    <>
      <section className="pagina-cabecera error-404"><div className="envoltura"><p className="eyebrow">Error 404</p><h1>Esta página no existe.</h1><p className="lead">Puede que el enlace esté mal escrito o que la página haya cambiado de dirección. Desde aquí llegas a lo que buscabas.</p><div className="hero-acciones"><a className="btn btn-primario" href="https://soulbyte.app/">Ir al inicio <svg className="ico"><use href="#i-flecha" /></svg></a> <a className="btn btn-contorno" href="https://soulbyte.app/conectar/">Conectar WhatsApp Business</a></div><ul className="enlaces-404"><li><a href="https://soulbyte.app/#que-incluye">Plataforma</a></li><li><a href="https://soulbyte.app/whatsapp-business-api/">WhatsApp Business</a></li><li><a href="https://soulbyte.app/#meta">Meta</a></li><li><a href="https://soulbyte.app/#instagram">Instagram</a></li><li><a href="https://soulbyte.app/google-merchant-center/">Google</a></li><li><a href="https://soulbyte.app/ecommerce-b2b-mayoristas/">Mayoristas</a></li><li><a href="https://soulbyte.app/#dropshipping">Dropshipping</a></li><li><a href="https://soulbyte.app/importacion-y-logistica/">Importación y logística</a></li><li><a href="https://soulbyte.app/vender-en-colombia/">Vender en Colombia</a></li><li><a href="https://soulbyte.app/automatizacion-empresas-de-servicios/">Empresas de servicios</a></li><li><a href="https://soulbyte.app/#preguntas">Preguntas frecuentes</a></li><li><a href="mailto:hola@soulbyte.app">hola@soulbyte.app</a></li></ul></div></section>
    </>
  );
}
