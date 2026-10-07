/** Contenido de /facebook-e-instagram/: el panel de redes de la plataforma (publicar, responder y respuestas automáticas). */
export const metadatos = {
  titulo: 'Facebook e Instagram para empresas en Colombia — Soulbyte',
  descripcion: 'Publica, programa y responde los comentarios y mensajes de Facebook e Instagram desde un panel, con respuestas automáticas que escribes tú, sin IA, y un resumen cada lunes.',
  ogTitulo: 'Facebook e Instagram para empresas en Colombia — Soulbyte',
  ogDescripcion: 'Publicaciones y carruseles programados, comentarios y mensajes en un solo lugar, y respuestas automáticas con tus reglas: menú del chat, preguntas al abrir el chat y menciones.',
  ruta: '/facebook-e-instagram/',
  noIndex: false,
};

export const jsonld: unknown[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://soulbyte.app/' },
      { '@type': 'ListItem', position: 2, name: 'Facebook e Instagram', item: 'https://soulbyte.app/facebook-e-instagram/' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Facebook e Instagram para empresas',
    serviceType: 'Gestión y respuestas automáticas de la página de Facebook, Messenger e Instagram de una empresa',
    url: 'https://soulbyte.app/facebook-e-instagram/',
    provider: { '@type': 'Organization', '@id': 'https://soulbyte.app/#organizacion', name: 'Soulbyte', url: 'https://soulbyte.app/' },
    areaServed: 'CO',
    audience: { '@type': 'BusinessAudience', audienceType: 'Tiendas, marcas y empresas de servicios en Colombia' },
    description:
      'Panel para la página de Facebook y la cuenta profesional de Instagram de una empresa: publicaciones y carruseles programados, comentarios y mensajes de Messenger e Instagram en un solo lugar, estadísticas y respuestas automáticas por reglas que escribe la empresa, sin inteligencia artificial: palabras clave, menú del chat, preguntas al abrir el chat, menciones de Instagram, avisos al equipo, actividad de 30 días y resumen semanal por correo.',
  },
];

export function Contenido() {
  return (
    <>
      <section className="hero">
        <div className="envoltura hero-grid">
          <div>
            <a className="chip" href="#respuestas">
              <span className="punto" aria-hidden="true"></span>Facebook, Messenger e Instagram · API oficial de Meta
            </a>
            <h1>
              Tu Facebook e Instagram, <em>desde un solo panel</em>.
            </h1>
            <p className="lead">
              Publica y programa, responde comentarios y mensajes, y deja que las preguntas de siempre se respondan solas con reglas que escribes tú, sin inteligencia artificial. Hoy atiende las páginas de Hit-Air Colombia y Ekivibes.
            </p>
            <div className="hero-acciones">
              <a className="btn btn-primario" href="/reservar/">
                Agenda una llamada <svg className="ico"><use href="#i-flecha" /></svg>
              </a>{' '}
              <a className="btn btn-oscuro-contorno" href="mailto:hola@soulbyte.app?subject=Quiero%20Facebook%20e%20Instagram%20con%20Soulbyte">
                Hablar con ventas
              </a>
            </div>
            <ul className="confianza">
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Todo arranca apagado: tú decides qué se responde solo
              </li>
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Tus páginas y tus seguidores siguen siendo tuyos
              </li>
              <li>
                <svg className="ico"><use href="#i-check-circulo" /></svg>Lo que no tiene regla le llega a tu equipo
              </li>
            </ul>
          </div>
          <div className="marco marco-hero">
            <div className="telefono" role="img" aria-label="Ilustración de un chat de Instagram atendido por Soulbyte: las preguntas al abrir el chat, el menú con botones y la respuesta a la opción Guía de tallas.">
              <div className="chat-cabecera" aria-hidden="true">
                <span className="avatar">TM</span>
                <div>
                  <b>tumarca</b>
                  <small>Instagram · cuenta de empresa</small>
                </div>
              </div>
              <div className="chat-cuerpo" aria-hidden="true">
                <div className="burbuja sale">
                  ¡Hola! Soy el asistente de Tu Marca. ¿En qué te ayudo?
                  <div className="opciones">
                    <span>Estado de mi pedido</span>
                    <span>Guía de tallas</span>
                    <span>Ver catálogo</span>
                    <span>Hablar con asesor</span>
                  </div>
                </div>
                <div className="burbuja entra">
                  Guía de tallas<span className="hora">10:21</span>
                </div>
                <div className="burbuja sale">
                  Aquí está nuestra guía de tallas: tumarca.com/guia-de-tallas. Si me dices tu estatura y tu peso, te ayudamos a elegir.<span className="hora">10:21</span>
                </div>
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
            <h2>Tus dos redes en un solo lugar, leídas en vivo de Meta.</h2>
            <p className="lead">Sin saltar entre la app de Facebook, la de Instagram y Business Suite. Si manejas varias marcas, cambias de una a otra con el mismo usuario.</p>
          </div>
          <div className="bento">
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-calendario" /></svg></span>
              <h3>Publicar y programar</h3>
              <p>Foto, enlace o carrusel de hasta diez fotos, en Facebook, Instagram o los dos, ahora o con fecha y hora. Si Meta falla por algo pasajero, la programada se reintenta sola.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-chat" /></svg></span>
              <h3>Comentarios</h3>
              <p>Responde, oculta o elimina los comentarios de tus publicaciones de Facebook e Instagram sin entrar a cada red.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-usuarios" /></svg></span>
              <h3>Mensajes de Messenger e Instagram</h3>
              <p>Las conversaciones de las dos bandejas, con respuesta desde el panel. Cuando respondes tú, el asistente se hace a un lado con esa persona durante 12 horas.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-grafico" /></svg></span>
              <h3>Estadísticas de Instagram</h3>
              <p>Seguidores, alcance, visitas al perfil, interacciones y lo que logró cada publicación: me gusta, comentarios, guardados y compartidos.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-campana" /></svg></span>
              <h3>Resumen cada lunes</h3>
              <p>Seguidores y cuánto cambiaron, alcance, publicaciones de la semana y lo que respondió el asistente, por tema, en el correo de tu negocio.</p>
            </article>
            <article className="baldosa">
              <span className="icono"><svg className="ico"><use href="#i-documento" /></svg></span>
              <h3>Actividad</h3>
              <p>Qué se respondió, a quién y con qué regla en los últimos 30 días, y lo que no se pudo enviar.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="respuestas" className="seccion">
        <div className="envoltura division">
          <div className="division-texto">
            <p className="eyebrow">Respuestas automáticas</p>
            <h2>Tú escribes las reglas. El panel las cumple, sin inventar nada.</h2>
            <p className="lead">Cada respuesta sale de un texto que escribiste. Lo que no tiene regla le llega a tu equipo, y cada parte tiene su interruptor.</p>
            <ul className="lista-check">
              <li>
                <svg className="ico"><use href="#i-check" /></svg>
                <span>
                  <b>Palabras clave.</b> «Precio», «talla», «envío»… valen al comienzo de una palabra y sin tildes. Cada regla responde en público, le escribe por privado a quien comentó, oculta el comentario o avisa a tu equipo.
                </span>
              </li>
              <li>
                <svg className="ico"><use href="#i-check" /></svg>
                <span>
                  <b>Menú del chat.</b> Un saludo y hasta cinco opciones como botones, cada una con su respuesta, y al final siempre «Hablar con alguien».
                </span>
              </li>
              <li>
                <svg className="ico"><use href="#i-check" /></svg>
                <span>
                  <b>Preguntas al abrir el chat.</b> Antes del primer mensaje, Messenger e Instagram muestran tus primeras opciones para tocar.
                </span>
              </li>
              <li>
                <svg className="ico"><use href="#i-check" /></svg>
                <span>
                  <b>Menciones de Instagram.</b> Agradece por mensaje a quien te menciona en su historia y te avisa cuando te mencionan en comentarios o publicaciones.
                </span>
              </li>
              <li>
                <svg className="ico"><use href="#i-check" /></svg>
                <span>
                  <b>Una persona cuando hace falta.</b> «Hablar con alguien» avisa a tu equipo y el asistente deja de responderle solo a esa persona. Con «stop» no le vuelve a responder hasta que escriba «hola».
                </span>
              </li>
            </ul>
            <p className="nota">Opera hoy en las páginas y cuentas de nuestras marcas. Para la página y el Instagram de tu empresa, Meta debe aprobar además el acceso avanzado de nuestra app, y la cuenta de Instagram debe ser profesional y estar conectada a la página.</p>
          </div>
          <div className="marco">
            <div className="publicacion" role="img" aria-label="Ilustración de una publicación con comentarios: las preguntas por el precio y por los envíos reciben respuestas automáticas.">
              <div className="publicacion-cabeza" aria-hidden="true">
                <span className="avatar">TM</span>tumarca
              </div>
              <div className="publicacion-imagen" aria-hidden="true">
                <span>Nueva colección</span>
              </div>
              <div className="comentarios" aria-hidden="true">
                <div>
                  <b>andres.moto</b> ¿Precio?
                </div>
                <div className="respuesta">
                  <b>tumarca</b>
                  <span className="marca-auto">Automático</span> ¡Hola! Te escribimos por mensaje privado con precios y tallas.
                </div>
                <div>
                  <b>carolina.r</b> ¿Hacen envíos a Cali?
                </div>
                <div className="respuesta">
                  <b>tumarca</b>
                  <span className="marca-auto">Automático</span> ¡Hola! Enviamos a todo Colombia. El costo lo ves al pagar, según tu ciudad.
                </div>
              </div>
            </div>
            <p className="leyenda">Ilustración con datos de ejemplo.</p>
          </div>
        </div>
      </section>

      <section id="limites" className="seccion suave">
        <div className="envoltura">
          <div className="cabecera">
            <p className="eyebrow">Límites</p>
            <h2>Responde rápido, pero no le escribe de más a nadie.</h2>
          </div>
          <div className="dos-columnas">
            <div className="caja">
              <h3>Lo que nunca hace</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Responderle a tu propia página o a tu propia cuenta.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Responder comentarios editados o lo que llegó hace más de seis horas.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Repetirle la misma regla a la misma persona antes de una hora, o mandarle el menú más de una vez cada media hora.</span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-check-circulo" /></svg>
                  <span>Pasar de 120 respuestas automáticas por hora en tu negocio.</span>
                </li>
              </ul>
            </div>
            <div className="caja estado-fase">
              <h3>Lo que no cambia</h3>
              <ul>
                <li>
                  <svg className="ico"><use href="#i-llave" /></svg>
                  <span>
                    <b>Tus cuentas siguen siendo tuyas.</b> La página, la cuenta de Instagram y sus seguidores siguen en el portafolio de tu empresa en Meta. Retiras el acceso cuando quieras desde Meta Business Suite.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-escudo" /></svg>
                  <span>
                    <b>Sin contraseñas.</b> La página se comparte con Soulbyte desde Meta: nunca te pedimos la clave de Facebook ni la de Instagram.
                  </span>
                </li>
                <li>
                  <svg className="ico"><use href="#i-pausa" /></svg>
                  <span>
                    <b>Se apaga con un clic.</b> Si apagas los mensajes, también se quitan de Meta las preguntas al abrir el chat.
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
            <h2>Tres pasos, sin instalar nada.</h2>
          </div>
          <ol className="pasos pasos-3">
            <li>
              <h3>Compartes tu página</h3>
              <p>Desde la configuración de tu negocio en Meta compartes con Soulbyte tu página de Facebook y la cuenta profesional de Instagram conectada a ella.</p>
            </li>
            <li>
              <h3>La habilitamos en tu panel</h3>
              <p>Tu página aparece en Redes con sus publicaciones, comentarios, mensajes y estadísticas, y la conectas con un clic.</p>
            </li>
            <li>
              <h3>Escribes tus reglas</h3>
              <p>Las palabras clave, el menú del chat y los avisos a tu equipo. Pruebas, y enciendes cada parte cuando quieras.</p>
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
            <h2>Sobre Facebook e Instagram con Soulbyte.</h2>
            <p className="lead">
              ¿Otra duda? Escríbenos a <a href="mailto:hola@soulbyte.app">hola@soulbyte.app</a>.
            </p>
          </div>
          <div>
            <details>
              <summary>¿Usan inteligencia artificial para responder?</summary>
              <p>No. Cada respuesta es un texto que escribes tú en el panel. Si un mensaje no coincide con ninguna regla, el asistente responde que lo recibió y le avisa a tu equipo.</p>
            </details>
            <details>
              <summary>¿Tengo que darles mi contraseña de Facebook o de Instagram?</summary>
              <p>No. Compartes la página con Soulbyte desde la configuración de tu negocio en Meta y puedes retirar ese acceso cuando quieras.</p>
            </details>
            <details>
              <summary>¿Qué pasa si un cliente quiere hablar con una persona?</summary>
              <p>Toca «Hablar con alguien» o lo pide, tu equipo recibe el aviso y el asistente deja de responderle solo. Si alguien de tu equipo le contesta desde el panel, el asistente se calla 12 horas con esa persona.</p>
            </details>
            <details>
              <summary>¿Puedo programar carruseles?</summary>
              <p>Sí, de hasta diez fotos: en Instagram sale como carrusel y en Facebook como una publicación con varias fotos. Puedes publicar en una red o en las dos a la vez.</p>
            </details>
            <details>
              <summary>¿Sirve para cualquier página?</summary>
              <p>Para la página de Facebook de tu empresa y la cuenta profesional de Instagram conectada a ella. Hoy opera en las cuentas de nuestras marcas; para las de otra empresa, Meta debe aprobar además el acceso avanzado de nuestra app.</p>
            </details>
            <details>
              <summary>¿Cuánto cuesta?</summary>
              <p>La instalación y la operación se cotizan según tus canales. Escríbenos a hola@soulbyte.app y te enviamos la propuesta.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: '0' }}>
        <div className="envoltura">
          <div className="cta">
            <div>
              <h2>Agenda una llamada y te mostramos el panel con tus redes.</h2>
              <p>Revisamos qué te preguntan hoy en comentarios y mensajes, y armamos contigo las primeras reglas.</p>
            </div>
            <div className="hero-acciones">
              <a className="btn btn-claro" href="/reservar/">
                Agenda una llamada <svg className="ico"><use href="#i-flecha" /></svg>
              </a>{' '}
              <a className="btn btn-oscuro-contorno" href="mailto:hola@soulbyte.app?subject=Quiero%20Facebook%20e%20Instagram%20con%20Soulbyte">
                Escribirnos
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
