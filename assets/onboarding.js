/* Soulbyte — conexión de WhatsApp Business (Meta Embedded Signup v4).
   La página nunca ve el App Secret ni tokens: envía el código de un solo uso a n8n,
   que hace el intercambio servidor-a-servidor. */
(function () {
  const N8N = 'https://n8n.hitaircolombia.com/webhook';
  const form = document.getElementById('ficha');
  const boton = document.getElementById('conectar');
  const estado = document.getElementById('estado');
  let cfg = null;
  let sesion = null;          // datos del evento WA_EMBEDDED_SIGNUP (waba_id, phone_number_id, business_id, event)
  let enviando = false;

  function mostrar(html, esError) {
    estado.innerHTML = html;
    estado.className = 'estado visible' + (esError ? ' error' : '');
  }

  function datosFormulario() {
    const v = id => (document.getElementById(id).value || '').trim();
    return { empresa: v('empresa'), contacto_nombre: v('nombre'), contacto_email: v('email'), contacto_telefono: v('telefono'), sitio_web: v('sitio') };
  }

  function formularioValido() {
    const d = datosFormulario();
    if (!d.empresa) { mostrar('Escribe el nombre de tu empresa antes de conectar.', true); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.contacto_email)) { mostrar('Escribe un correo de contacto válido.', true); return false; }
    return true;
  }

  // 1) Configuración pública (app_id, config_id) desde n8n
  fetch(N8N + '/soulbyte-onboarding-config', { cache: 'no-store' })
    .then(r => r.json())
    .then(c => {
      cfg = c;
      if (!c.habilitado) {
        boton.disabled = true;
        mostrar('El registro de nuevos comercios está en configuración. Déjanos tus datos por correo a <a href="mailto:ivancorrea@plazablack.com">ivancorrea@plazablack.com</a> y te avisamos cuando abra.');
        return;
      }
      cargarSDK(c.app_id, c.version || 'v25.0');
    })
    .catch(() => { boton.disabled = true; mostrar('No se pudo cargar la configuración. Recarga la página o escríbenos.', true); });

  // 2) SDK de Meta
  function cargarSDK(appId, version) {
    window.fbAsyncInit = function () {
      FB.init({ appId: appId, autoLogAppEvents: true, xfbml: false, version: version });
      boton.disabled = false;
    };
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/es_LA/sdk.js'; s.async = true; s.defer = true; s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  // 3) Evento de sesión del flujo (identificadores de la cuenta creada/compartida)
  window.addEventListener('message', function (event) {
    if (!event.origin.endsWith('facebook.com')) return;
    try {
      const data = JSON.parse(event.data);
      if (data.type !== 'WA_EMBEDDED_SIGNUP') return;
      if (data.event === 'CANCEL') {
        const paso = data.data && data.data.current_step;
        const err = data.data && data.data.error_message;
        mostrar(err ? 'Meta reportó un error en el flujo: ' + err + (data.data.error_code ? ' (código ' + data.data.error_code + ')' : '')
                    : 'Cerraste la ventana de Meta' + (paso ? ' en el paso <code>' + paso + '</code>' : '') + '. Puedes volver a intentarlo cuando quieras.', true);
        return;
      }
      sesion = Object.assign({ event: data.event }, data.data || {});
    } catch (e) { /* mensajes que no son del flujo */ }
  });

  // 4) Callback de FB.login: llega el código de un solo uso (30 s de vida)
  function alTerminar(response) {
    if (!(response.authResponse && response.authResponse.code)) {
      if (!estado.classList.contains('visible')) mostrar('No se completó la autorización en Meta. Puedes intentarlo de nuevo.', true);
      return;
    }
    const code = response.authResponse.code;
    let intentos = 0;
    (function esperarSesion() {
      if (sesion || intentos >= 20) return enviar(code);
      intentos++; setTimeout(esperarSesion, 150);
    })();
  }

  function enviar(code) {
    if (enviando) return; enviando = true;
    boton.disabled = true;
    mostrar('Conectando tu cuenta con Soulbyte…');
    const cuerpo = Object.assign({ code: code }, datosFormulario(), {
      waba_id: sesion && sesion.waba_id || '', phone_number_id: sesion && sesion.phone_number_id || '',
      business_id: sesion && sesion.business_id || '', event: sesion && sesion.event || 'FINISH'
    });
    fetch(N8N + '/soulbyte-onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(r => r.json().then(j => ({ ok: r.ok, j: j })))
      .then(({ ok, j }) => {
        enviando = false; boton.disabled = false;
        if (!ok || !j.ok) { mostrar('No se pudo completar la conexión: ' + (j.error || 'error desconocido') + '. Escríbenos y lo revisamos.', true); return; }
        const t = j.tenant || {};
        const numero = t.display_phone_number || t.phone_number_id || 'sin número todavía';
        mostrar('<p><b>Listo, ' + escapar(t.empresa || '') + '.</b> Tu cuenta de WhatsApp Business quedó conectada a Soulbyte.</p>' +
                '<p>Número: <code>' + escapar(numero) + '</code>' + (t.verified_name ? ' · nombre verificado: ' + escapar(t.verified_name) : '') + '<br>Estado: ' + escapar(j.estado) + ' · registro del número: ' + escapar(j.registro) + '</p>' +
                (j.estado !== 'conectado' ? '<p>Falta un paso: ' + escapar(j.errores || j.registro) + '. Te escribimos al correo de contacto para resolverlo.</p>' : '') +
                '<p>Recuerda añadir un método de pago a tu cuenta de WhatsApp Business en Meta Business Suite; sin él Meta no permite enviar mensajes. Te contactamos en máximo un día hábil para activar tus plantillas.</p>');
        form.reset(); sesion = null;
      })
      .catch(() => { enviando = false; boton.disabled = false; mostrar('No hubo respuesta del servidor. Intenta de nuevo en un minuto.', true); });
  }

  function escapar(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // 5) Botón: abre el flujo de Meta con datos de la empresa pre-cargados
  boton.addEventListener('click', function () {
    if (!cfg || !cfg.habilitado || typeof FB === 'undefined') { mostrar('Meta todavía no está listo. Espera un momento y vuelve a intentar.', true); return; }
    if (!formularioValido()) return;
    const d = datosFormulario();
    estado.className = 'estado'; sesion = null;
    const setup = { business: { name: d.empresa, email: d.contacto_email } };
    if (d.sitio_web) setup.business.website = d.sitio_web;
    FB.login(alTerminar, { config_id: cfg.config_id, response_type: 'code', override_default_response_type: true, extras: { setup: setup } });
  });
})();
