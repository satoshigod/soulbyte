/** Contenido de /mercadolibre/: el canal de MercadoLibre de la plataforma (publicar el catálogo, mantenerlo al día, ventas y preguntas). */
export const metadatos = {
  titulo: 'MercadoLibre para tiendas en Colombia — Soulbyte',
  descripcion: 'Publica tu catálogo en MercadoLibre desde el panel: revisión antes de publicar, precio y existencia al día cada 15 minutos, y ventas y preguntas en el mismo lugar.',
  ogTitulo: 'MercadoLibre para tiendas en Colombia — Soulbyte',
  ogDescripcion: 'Tu catálogo en MercadoLibre sin cargar producto por producto: fichas revisadas, envío por producto, lo agotado en pausa y cada venta descontada de tu inventario.',
  ruta: '/mercadolibre/',
  noIndex: false,
};

export const jsonld: unknown[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://soulbyte.app/' },
      { '@type': 'ListItem', position: 2, name: 'MercadoLibre', item: 'https://soulbyte.app/mercadolibre/' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'MercadoLibre para tiendas',
    serviceType: 'Publicación y sincronización del catálogo de una tienda en MercadoLibre Colombia',
    url: 'https://soulbyte.app/mercadolibre/',
    provider: { '@type': 'Organization', '@id': 'https://soulbyte.app/#organizacion', name: 'Soulbyte', url: 'https://soulbyte.app/' },
    areaServed: 'CO',
    audience: { '@type': 'BusinessAudience', audienceType: 'Tiendas, marcas e importadores que venden en MercadoLibre Colombia' },
    description:
      'Conexión de la cuenta de MercadoLibre del comercio con su catálogo: publicaciones revisadas por MercadoLibre antes de salir, con tallas y colores en una misma publicación y el envío de cada producto; precio, existencia y descripción al día cada 15 minutos; pausa de lo agotado; aviso al equipo por cada venta pagada, con la existencia descontada una sola vez, y preguntas respondidas desde el panel.',
  },
];

export function Contenido() {
  return (
    <>
      <section className="hero">
        <div className="envoltura hero-grid">
          <div>
            <a className="chip" href="#como-se-conecta">
              <span className="punto" aria-hidden="true"></span>MercadoLibre Colombia · API oficial
            </a>
            <h1>
              Tu catálogo en MercadoLibre, <em>al día sin tocarlo</em>.
            </h1>
            <p className="lead">
              Publica los productos de tu tienda o de tu panel sin cargarlos uno por uno. El precio, la existencia y la descripción se actualizan solos, lo agotado se pausa y las ventas y preguntas te llegan al panel. Hoy publica el catálogo de Hit-Air Colombia y Ekivibes.
            </p>
            <div className="hero-acciones">
              <a className="btn btn-primario" href="/reservar/">
                Agenda una llamada <svg className="ico"><use href="#i-flecha" /></svg>
              </a>{' '}
              <a className="btn btn-oscuro-contorno" href="mailto:hola@soulbyte.app?subject=Quiero%20vender%20en%20MercadoLibre%20con%20Soulbyte">
                Hablar con ventas
              </a>
            </div>
            <ul className="confianza">
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Nada sale sin pasar la revisión de MercadoLibre
              </li>
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Una referencia, una sola publicación
              </li>
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Tu cuenta de MercadoLibre sigue siendo tuya
              </li>
            </ul>
          </div>
          <div className="marco marco-hero">
            <div role="img" aria-label="Ilustración con datos de ejemplo: tres productos del catálogo con su estado en MercadoLibre y la última actualización de precio y existencia.">
              <div className="resultados" aria-hidden="true">
                <div className="producto">
                  <div className="foto"></div>
                  <b>Producto A · talla M</b>
                  <span className="precio">$ 890.000</span>
                  <small>Publicada · envío gratis</small>
                </div>
                <div className="producto">
                  <div className="foto"></div>
                  <b>Producto B</b>
                  <span className="precio">$ 1.250.000</span>
                  <small>Lista para publicar</small>
                </div>
                <div className="producto">
                  <div className="foto"></div>
                  <b>Accesorio</b>
                  <span className="precio">$ 120.000</span>
                  <small>En pausa: agotado</small>
                </div>
              </div>
              <div className="estado-feed" aria-hidden="true">
                <span className="icono-mini">
                  <svg className="ico"><use href="#i-cajas" /></svg>
                </span>
                <div>
                  <b>Precio y existencia en MercadoLibre</b>
                  <span>Hoy, 10:15 · se revisan cada 15 minutos</span>
                </div>
                <span className="pildora ok">Al día</span>
              </div>
            </div>
            <p className="leyenda">Ilustración con datos de ejemplo.</p>
          </div>
        </div>
      </section>

      <section id="que-hace" className="seccion suave">
        <div className="envoltura">
          <div className="cabecera">
            <p className="eyebrow">Qué hace el panel</p>
            <h2>Del catálogo a MercadoLibre, y de vuelta con cada venta.</h2>
            <p className="lead">Tu catálogo sigue en un solo lugar. MercadoLibre es un canal más: lo que cambias en el catálogo llega allá, y lo que se vende allá vuelve a tu panel.</p>
          </div>
          <div className="bento">
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-capas" /></svg></span>
              <h3>Desde tu catálogo</h3>
              <p>Título, fotos, precio con IVA, existencia, marca, código de barras, referencia, tallas, colores y medidas salen del catálogo, venga de tu tienda en línea, del panel o de un Excel.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-documento" /></svg></span>
              <h3>Una ficha por producto</h3>
              <p>Lo que solo va en MercadoLibre: título, categoría, modelo, garantía, descripción propia, fotos adicionales y un video de YouTube, con la vista previa de la publicación.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-buscar" /></svg></span>
              <h3>La categoría correcta</h3>
              <p>La buscas en MercadoLibre desde la ficha y ves, antes de publicar, si junta tallas y colores en una sola publicación y si tiene Mercado Envíos.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-check-circulo" /></svg></span>
              <h3>Revisión antes de publicar</h3>
              <p>MercadoLibre revisa cada publicación sin publicarla: queda «Lista para publicar» o «Por corregir» con lo que falta. Si por el precio exige envío gratis, la revisión se ajusta sola.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-reloj" /></svg></span>
              <h3>Al día cada 15 minutos</h3>
              <p>El precio y la existencia cuando cambian, la descripción cuando la editas. Lo agotado se pausa y vuelve a salir cuando hay unidades.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-campana" /></svg></span>
              <h3>Ventas y preguntas</h3>
              <p>Cada venta pagada le avisa a tu equipo por correo y WhatsApp y descuenta la existencia una sola vez; si se cancela, vuelve. Las preguntas se responden desde el panel.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="envios" className="seccion">
        <div className="envoltura">
          <div className="cabecera">
            <p className="eyebrow">Envíos y reglas</p>
            <h2>Cada producto sale con su envío y con las reglas de tu cuenta.</h2>
          </div>
          <div className="dos-columnas">
            <div className="caja">
              <h3>Envío por producto</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>
                    <b>Mercado Envíos.</b> Desde $60.000 MercadoLibre exige el envío gratis en Colombia: la publicación sale así sin que tengas que corregirla.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>
                    <b>Entrega acordada.</b> Para lo que MercadoLibre no deja enviar, como lo que lleva un cartucho de gas: la ficha pide «Sin Mercado Envíos» y la entrega se acuerda con quien compra.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>
                    <b>A la vista.</b> Cada publicación dice en el panel cómo se envía. Si MercadoLibre marca un producto como inflamable, su ficha queda sin Mercado Envíos sola.
                  </span>
                </li>
              </ul>
            </div>
            <div className="caja">
              <h3>Reglas de tu cuenta</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-porcentaje" /></svg>
                  <span>
                    <b>Precio.</b> El mismo de tu tienda o con un recargo para toda la cuenta, y un precio fijo en la ficha cuando un producto lo necesita.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-documento" /></svg>
                  <span>
                    <b>Publicación y garantía.</b> Con o sin cuotas extra, la garantía que ofreces y un texto que va al final de cada descripción.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-capas" /></svg>
                  <span>
                    <b>Categorías.</b> Una categoría de MercadoLibre para cada categoría de tu catálogo, y las tallas y colores en la misma publicación.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="limites" className="seccion suave">
        <div className="envoltura">
          <div className="cabecera">
            <p className="eyebrow">Límites</p>
            <h2>Publica rápido, pero nada a ciegas.</h2>
          </div>
          <div className="dos-columnas">
            <div className="caja">
              <h3>Lo que nunca hace</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Publicar algo que no pasó la revisión, o publicar dos veces la misma referencia, aunque dos negocios usen la misma cuenta.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Poner datos de contacto en una descripción: la frase que los tenga se quita completa.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Reactivar por su cuenta lo que tú o una revisión de MercadoLibre pausaron allá: queda marcado hasta que lo reanudes.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Subir fotos de menos de 500 píxeles, que MercadoLibre deja en revisión por horas.</span>
                </li>
              </ul>
            </div>
            <div className="caja estado-fase">
              <h3>Lo que no cambia</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-llave" /></svg>
                  <span>
                    <b>Tu cuenta sigue siendo tuya.</b> La autorizas entrando a MercadoLibre con tu usuario: nunca te pedimos la contraseña. La desconectas cuando quieras.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-escudo" /></svg>
                  <span>
                    <b>Acceso cifrado.</b> El acceso que entrega MercadoLibre se guarda cifrado y solo sirve para tu cuenta.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-camion" /></svg>
                  <span>
                    <b>Despachos, guías y reclamos</b> se siguen manejando en MercadoLibre.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="como-se-conecta" className="seccion">
        <div className="envoltura">
          <div className="cabecera">
            <p className="eyebrow">Cómo se conecta</p>
            <h2>Tres pasos, sin cargar productos a mano.</h2>
          </div>
          <ol className="pasos pasos-3">
            <li>
              <h3>Conectas tu cuenta</h3>
              <p>Desde el panel entras a MercadoLibre con tu usuario y autorizas la conexión. Tus publicaciones de antes siguen como están.</p>
            </li>
            <li>
              <h3>Revisas tus fichas</h3>
              <p>Eliges qué productos van, su categoría y su envío. MercadoLibre revisa cada publicación sin publicarla y te dice si falta algo.</p>
            </li>
            <li>
              <h3>Publicas y queda al día</h3>
              <p>Sale lo que pasó la revisión. Desde ahí, el precio, la existencia y la descripción se actualizan solos y las ventas llegan al panel.</p>
            </li>
          </ol>
          <div className="hero-acciones centrado">
            <a className="btn btn-primario" href="/reservar/">
              Agenda una llamada <svg className="ico"><use href="#i-flecha" /></svg>
            </a>
          </div>
        </div>
      </section>

      <section id="preguntas" className="seccion faq suave">
        <div className="envoltura faq-grid">
          <div className="cabecera-lateral">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2>Sobre MercadoLibre con Soulbyte.</h2>
            <p className="lead">
              ¿Otra duda? Escríbenos a <a href="mailto:hola@soulbyte.app">hola@soulbyte.app</a>.
            </p>
          </div>
          <div>
            <details>
              <summary>¿Necesito tener tienda en línea?</summary>
              <p>No. El catálogo puede venir de tu tienda en línea conectada, de los productos que cargas en el panel o de un Excel.</p>
            </details>
            <details>
              <summary>¿Qué pasa si vendo el mismo producto en mi tienda y en MercadoLibre?</summary>
              <p>La existencia se mantiene en un solo lugar. Una venta pagada en MercadoLibre se descuenta una sola vez y vuelve si se cancela. Si tu tienda en línea está conectada con su inventario, la venta se descuenta allá y de ahí vuelve al panel y a MercadoLibre.</p>
            </details>
            <details>
              <summary>¿Puedo tener otro precio en MercadoLibre?</summary>
              <p>Sí: un recargo para toda la cuenta o un precio fijo en la ficha de cada producto. Si no pones nada, sale el mismo precio de tu tienda, con IVA incluido.</p>
            </details>
            <details>
              <summary>¿Qué pasa con las tallas y los colores?</summary>
              <p>Van en una sola publicación cuando la categoría las junta. Si tu cuenta publica cada talla con su propio precio, cada una queda dentro de la misma familia del producto.</p>
            </details>
            <details>
              <summary>¿Cobran comisión por venta?</summary>
              <p>Soulbyte no cobra comisión por venta. MercadoLibre cobra sus cargos por vender y por el envío según su tarifa. La instalación y la operación se cotizan según tus canales: escríbenos a hola@soulbyte.app.</p>
            </details>
            <details>
              <summary>¿Y los despachos y los reclamos?</summary>
              <p>Se manejan en MercadoLibre, como siempre. En el panel ves cada venta, su estado y lo que se vendió.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: '0' }}>
        <div className="envoltura">
          <div className="cta">
            <div>
              <h2>Agenda una llamada y revisamos tu catálogo para MercadoLibre.</h2>
              <p>Vemos qué productos pueden salir hoy, en qué categoría y con qué envío.</p>
            </div>
            <div className="hero-acciones">
              <a className="btn btn-claro" href="/reservar/">
                Agenda una llamada <svg className="ico"><use href="#i-flecha" /></svg>
              </a>{' '}
              <a className="btn btn-oscuro-contorno" href="mailto:hola@soulbyte.app?subject=Quiero%20vender%20en%20MercadoLibre%20con%20Soulbyte">
                Escribirnos
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
