/* Conexión con TikTok (TikTok API for Business, autorización del titular de la cuenta).
   La página nunca ve la contraseña ni el secreto de la app: TikTok devuelve aquí un código de un solo uso
   (válido 10 minutos) y n8n lo cambia por los tokens. La URL de autorización y el interruptor salen de n8n. */
(function () {
  var N8N = 'https://n8n.hitaircolombia.com/webhook';
  var CLAVE = 'sb_tiktok_state';
  var boton = document.getElementById('conectar-tiktok');
  var nota = document.getElementById('nota');
  var estado = document.getElementById('estado');
  function escapar(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mostrar(html, esError) { estado.innerHTML = html; estado.className = 'estado visible' + (esError ? ' error' : ''); }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function borrar(k) { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  var CONTACTO = ' Escríbenos a <a href="mailto:hola@soulbyte.app?subject=Conectar%20TikTok">hola@soulbyte.app</a> y lo resolvemos.';

  /* 1. Regreso desde TikTok: ?code=…&state=… o ?error=… */
  var q = new URLSearchParams(location.search);
  var code = q.get('code') || q.get('auth_code');
  var state = q.get('state') || '';
  var error = q.get('error') || q.get('error_code');
  var detalle = q.get('error_description') || '';
  if (code || error) { try { history.replaceState(null, '', location.pathname); } catch (e) { /* sin historial */ } }
  if (error) {
    borrar(CLAVE);
    mostrar('<p><b>TikTok no completó la autorización.</b>' + (detalle ? ' Motivo: ' + escapar(detalle.slice(0, 200)) + '.' : '') + ' Puedes intentarlo de nuevo con el botón.</p>', true);
  } else if (code) {
    var esperado = leer(CLAVE);
    borrar(CLAVE);
    if (esperado && state !== esperado) {
      mostrar('<p><b>Esta autorización no empezó en esta página o ya se usó.</b> Pulsa «Conectar con TikTok» otra vez.</p>', true);
    } else {
      mostrar('<p>Recibimos tu autorización. Estamos terminando la conexión…</p>', false);
      fetch(N8N + '/soulbyte-tiktok-conexion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, state: state }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          var j = res.j || {};
          if (res.ok && j.ok) {
            var cuenta = j.cuenta || {};
            mostrar('<p><b>Cuenta conectada.</b>' + (cuenta.usuario ? ' @' + escapar(cuenta.usuario) : ' Tu cuenta de TikTok') + ' quedó conectada a Soulbyte.</p><p>Te escribimos en máximo un día hábil para la puesta en marcha.</p>', false);
          } else {
            mostrar('<p><b>No pudimos terminar la conexión.</b>' + (j.mensaje ? ' ' + escapar(j.mensaje) + '.' : '') + ' Vuelve a pulsar «Conectar con TikTok» en unos minutos.' + CONTACTO + '</p>', true);
          }
        })
        .catch(function () { mostrar('<p><b>No pudimos terminar la conexión.</b> Revisa tu conexión a internet y vuelve a pulsar «Conectar con TikTok».' + CONTACTO + '</p>', true); });
    }
  }

  /* 2. Configuración: el botón se habilita solo cuando n8n entrega la URL de autorización de TikTok */
  fetch(N8N + '/soulbyte-tiktok-config', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (c) {
      if (!c || !c.habilitado || !/^https:\/\/www\.tiktok\.com\//.test(c.auth_url || '')) return;
      boton.disabled = false;
      nota.innerHTML = 'Se abre la página de TikTok para que autorices a Soulbyte. Al terminar, TikTok te devuelve a esta página.';
      boton.addEventListener('click', function () {
        var aleatorio = new Uint8Array(16);
        (window.crypto || window.msCrypto).getRandomValues(aleatorio);
        var s = Array.prototype.map.call(aleatorio, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
        guardar(CLAVE, s);
        var u = new URL(c.auth_url);
        u.searchParams.set('state', s);
        location.href = u.toString();
      });
    })
    .catch(function () { /* sin configuración: el botón sigue deshabilitado con la nota de espera */ });
})();
