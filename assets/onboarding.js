/* Soulbyte — conexión de WhatsApp Business para comercios (Tech Provider de Meta).
   Dos vías, ambas configuradas desde n8n (GET /soulbyte-onboarding-config):
     1) Registro guiado por Meta ("hosted Embedded Signup"): se abre la página de registro
        que Meta aloja para Soulbyte (hosted_url). La cuenta queda compartida con la app y
        Meta avisa por webhook (account_update / PARTNER_ADDED). Aquí solo guardamos el lead.
     2) Registro integrado (Embedded Signup con el SDK JS, config_id): el código de un solo uso
        se envía a n8n, que hace el intercambio servidor-a-servidor.
   La página nunca ve el App Secret ni tokens. */
(function () {
  const N8N = 'https://n8n.hitaircolombia.com/webhook';
  const form = document.getElementById('ficha');
  const botonMeta = document.getElementById('conectar-meta');
  const botonSDK = document.getElementById('conectar');
  const nota = document.getElementById('nota');
  const estado = document.getElementById('estado');
  let cfg = null;
  let sesion = null;          // datos del evento WA_EMBEDDED_SIGNUP (waba_id, phone_number_id, business_id, event)
  let enviando = false;

  function mostrar(html, esError) {
    estado.innerHTML = html;
    estado.className = 'estado visible' + (esError ? ' error' : '');
  }
  function escapar(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function datosFormulario() {
    const v = id => (document.getElementById(id).value || '').trim();
    return { empresa: v('empresa'), contacto_nombre: v('nombre'), contacto_email: v('email'), contacto_telefono: v('telefono'), sitio_web: v('sitio') };
  }
  function formularioValido() {
    const d = datosFormulario();
    if (!d.empresa) { mostrar('Escribe el nombre de tu empresa antes de continuar.', true); document.getElementById('empresa').focus(); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.contacto_email)) { mostrar('Escribe un correo de contacto válido.', true); document.getElementById('email').focus(); return false; }
    return true;
  }

  // 1) Configuración pública desde n8n
  fetch(N8N + '/soulbyte-onboarding-config', { cache: 'no-store' })
    .then(r => r.json())
    .then(c => {
      cfg = c;
      const hayMeta = !!(c.habilitado_hosted && c.hosted_url);
      const haySDK = !!c.habilitado;
      if (hayMeta) botonMeta.disabled = false;
      if (haySDK) { botonSDK.classList.remove('oculto'); cargarSDK(c.app_id, c.version || 'v25.0'); }
      if (!hayMeta && !haySDK) {
        botonMeta.disabled = true;
        nota.classList.add('oculto');
        mostrar('El registro de nuevos comercios está en configuración. Déjanos tus datos por correo a <a href="mailto:hola@soulbyte.app?subject=Conectar%20WhatsApp%20Business%20con%20Soulbyte">hola@soulbyte.app</a> y te avisamos cuando abra.');
      } else if (!hayMeta) {
        botonMeta.classList.add('oculto');
        nota.textContent = 'La conexión se hace en una ventana de Meta sin salir de esta página.';
      }
    })
    .catch(() => { botonMeta.disabled = true; nota.classList.add('oculto'); mostrar('No se pudo cargar la configuración. Recarga la página o escríbenos a <a href="mailto:hola@soulbyte.app">hola@soulbyte.app</a>.', true); });

  // 2) Vía 1: registro guiado por Meta. Guarda el lead y abre la página de registro de Meta.
  botonMeta.addEventListener('click', function () {
    if (!cfg || !cfg.hosted_url) { mostrar('El registro de Meta todavía no está disponible. Intenta en un momento.', true); return; }
    if (!formularioValido()) return;
    const d = datosFormulario();
    // Abrir primero (dentro del clic, para que el navegador no lo bloquee); luego guardar el lead.
    const ventana = window.open(cfg.hosted_url, '_blank');
    if (ventana) { try { ventana.opener = null; } catch (e) { /* sin opener */ } }
    guardarLead(d, ventana);
  });

  function guardarLead(d, ventana) {
    const cuerpo = Object.assign({ via: 'hosted' }, d);
    mostrar('Guardando tus datos…');
    fetch(N8N + '/soulbyte-onboarding-lead', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(r => r.json().then(j => ({ ok: r.ok, j: j })))
      .then(({ ok, j }) => {
        const guardado = ok && j.ok;
        mostrar(
          (ventana
            ? '<p><b>Se abrió el registro de Meta en otra pestaña.</b> Termina ahí los pasos: inicia sesión, elige o crea tu cuenta de WhatsApp Business y verifica el número.</p>'
            : '<p><b>Tu navegador bloqueó la ventana.</b> Abre el registro de Meta aquí: <a href="' + escapar(cfg.hosted_url) + '" target="_blank" rel="noopener">registro de WhatsApp Business para Soulbyte</a>.</p>') +
          (guardado
            ? '<p>Registramos a <b>' + escapar(d.empresa) + '</b>. Cuando Meta nos comparta tu cuenta, te escribimos a ' + escapar(d.contacto_email) + ' en máximo un día hábil para registrar el número y activar tus plantillas.</p>'
            : '<p>No pudimos guardar tus datos automáticamente. Cuando termines en Meta, escríbenos a <a href="mailto:hola@soulbyte.app?subject=Conect%C3%A9%20WhatsApp%20Business%20con%20Soulbyte">hola@soulbyte.app</a> con el nombre de tu empresa para completar la activación.</p>') +
          '<p>Recuerda añadir un método de pago a tu cuenta de WhatsApp Business en Meta Business Suite; sin él Meta no permite enviar mensajes.</p>'
        );
      })
      .catch(() => {
        mostrar('<p><b>Se abrió el registro de Meta en otra pestaña.</b> No hubo respuesta de nuestro servidor al guardar tus datos; cuando termines en Meta, escríbenos a <a href="mailto:hola@soulbyte.app?subject=Conect%C3%A9%20WhatsApp%20Business%20con%20Soulbyte">hola@soulbyte.app</a> con el nombre de tu empresa.</p>');
      });
  }

  // 3) Vía 2: registro integrado (SDK de Meta, Embedded Signup con response_type 'code')
  function cargarSDK(appId, version) {
    window.fbAsyncInit = function () {
      FB.init({ appId: appId, autoLogAppEvents: true, xfbml: false, version: version });
      botonSDK.disabled = false;
    };
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/es_LA/sdk.js'; s.async = true; s.defer = true; s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  window.addEventListener('message', function (event) {
    if (!event.origin.endsWith('facebook.com')) return;
    try {
      const data = JSON.parse(event.data);
      if (data.type !== 'WA_EMBEDDED_SIGNUP') return;
      if (data.event === 'CANCEL') {
        const paso = data.data && data.data.current_step;
        const err = data.data && data.data.error_message;
        mostrar(err ? 'Meta reportó un error en el flujo: ' + escapar(err) + (data.data.error_code ? ' (código ' + escapar(data.data.error_code) + ')' : '')
                    : 'Cerraste la ventana de Meta' + (paso ? ' en el paso <code>' + escapar(paso) + '</code>' : '') + '. Puedes volver a intentarlo cuando quieras.', true);
        return;
      }
      sesion = Object.assign({ event: data.event }, data.data || {});
    } catch (e) { /* mensajes que no son del flujo */ }
  });

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
    botonSDK.disabled = true;
    mostrar('Conectando tu cuenta con Soulbyte…');
    const cuerpo = Object.assign({ code: code }, datosFormulario(), {
      waba_id: sesion && sesion.waba_id || '', phone_number_id: sesion && sesion.phone_number_id || '',
      business_id: sesion && sesion.business_id || '', event: sesion && sesion.event || 'FINISH'
    });
    fetch(N8N + '/soulbyte-onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(r => r.json().then(j => ({ ok: r.ok, j: j })))
      .then(({ ok, j }) => {
        enviando = false; botonSDK.disabled = false;
        if (!ok || !j.ok) { mostrar('No se pudo completar la conexión: ' + escapar(j.error || 'error desconocido') + '. Escríbenos y lo revisamos.', true); return; }
        const t = j.tenant || {};
        const numero = t.display_phone_number || t.phone_number_id || 'sin número todavía';
        mostrar('<p><b>Listo, ' + escapar(t.empresa || '') + '.</b> Tu cuenta de WhatsApp Business quedó conectada a Soulbyte.</p>' +
                '<p>Número: <code>' + escapar(numero) + '</code>' + (t.verified_name ? ' · nombre verificado: ' + escapar(t.verified_name) : '') + '<br>Estado: ' + escapar(j.estado) + ' · registro del número: ' + escapar(j.registro) + '</p>' +
                (j.estado !== 'conectado' ? '<p>Falta un paso: ' + escapar(j.errores || j.registro) + '. Te escribimos al correo de contacto para resolverlo.</p>' : '') +
                '<p>Recuerda añadir un método de pago a tu cuenta de WhatsApp Business en Meta Business Suite; sin él Meta no permite enviar mensajes. Te contactamos en máximo un día hábil para activar tus plantillas.</p>');
        form.reset(); sesion = null;
      })
      .catch(() => { enviando = false; botonSDK.disabled = false; mostrar('No hubo respuesta del servidor. Intenta de nuevo en un minuto.', true); });
  }

  botonSDK.addEventListener('click', function () {
    if (!cfg || !cfg.habilitado || typeof FB === 'undefined') { mostrar('Meta todavía no está listo. Espera un momento y vuelve a intentar.', true); return; }
    if (!formularioValido()) return;
    const d = datosFormulario();
    estado.className = 'estado'; sesion = null;
    const setup = { business: { name: d.empresa, email: d.contacto_email } };
    if (d.sitio_web) setup.business.website = d.sitio_web;
    FB.login(alTerminar, { config_id: cfg.config_id, response_type: 'code', override_default_response_type: true, extras: { setup: setup } });
  });
})();
