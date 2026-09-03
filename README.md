# Soulbyte — sitio y onboarding de WhatsApp (Tech Provider)

Sitio estático servido por GitHub Pages desde `main` (raíz): https://satoshigod.github.io/soulbyte/

| Ruta | Qué es |
|---|---|
| `index.html` | Presentación de Soulbyte como proveedor tecnológico de e-commerce (fase 1 en producción con Hit-Air Colombia y Ekivibes). |
| `conectar/` | **Embedded Signup v4** de WhatsApp Business. La página obtiene `app_id`/`config_id` de n8n, abre el flujo de Meta y envía el código de un solo uso al backend. Nunca ve el App Secret ni tokens. |
| `privacidad/` | Política de privacidad de la plataforma. |
| `assets/onboarding.js` | Lógica del flujo (SDK de Meta, evento `WA_EMBEDDED_SIGNUP`, `FB.login` con `response_type: 'code'`). |

## Backend (n8n, `https://n8n.hitaircolombia.com`)

Workflow **"Soulbyte — onboarding WhatsApp de comercios (Embedded Signup, Tech Provider)"** (`va7vfi9YbATCZFlf`):

- `GET /webhook/soulbyte-onboarding-config` → `{app_id, config_id, version, habilitado}` leído de NocoDB `parametros` (`meta_app_id`, `meta_es_config_id`, `meta_graph_version`). CORS restringido a `https://satoshigod.github.io` (`parametros.soulbyte_onboarding_origen`, informativo; el valor real está en el nodo Webhook).
- `POST /webhook/soulbyte-onboarding` `{code, waba_id, phone_number_id, business_id, event, empresa, contacto_*, sitio_web}` →
  1. valida y genera `clave` + PIN de 6 dígitos;
  2. `GET /oauth/access_token` (client_secret desde la credencial n8n **"Meta — App Secret (Soulbyte n8n, query client_secret)"**) → business token;
  3. `POST /{waba_id}/subscribed_apps`;
  4. `GET /{phone_number_id}` y `GET /{waba_id}`;
  5. `POST /{phone_number_id}/register` solo si el número **no** está ya en Cloud API conectado (protege números existentes);
  6. upsert en NocoDB `tenants` (`m9flo5er05seh7b`) por `waba_id`;
  7. aviso interno por el portero del equipo (llega por correo) y respuesta JSON a la página.

Tenant 1 (`clave=soulbyte`) es la operación propia: su token vive en el vault de n8n, no en la tabla.

## Configuración pendiente en el panel de Meta (app "Soulbyte n8n" 1781576016329423)

1. **Facebook Login for Business → Settings**: Client OAuth login, Web OAuth login, Enforce HTTPS, Embedded Browser OAuth Login, Strict Mode, Login with the JavaScript SDK = Sí. *Allowed Domains for the JavaScript SDK*: `satoshigod.github.io`. *Valid OAuth Redirect URIs*: `https://satoshigod.github.io/soulbyte/conectar/`.
2. **Facebook Login for Business → Configurations → Create from template → "WhatsApp Embedded Signup Configuration"** → copiar el *Configuration ID* a NocoDB `parametros.meta_es_config_id`.
3. **App settings → Basic**: *App Domains* añadir `satoshigod.github.io`; copiar el *App Secret* a la credencial n8n indicada arriba.
4. **WhatsApp → Configuration → Webhooks**: suscribir también `account_update` (además de `messages`).

Cuando el dominio definitivo exista, cambiar: `allowedOrigins` del nodo Webhook, `parametros.soulbyte_onboarding_origen`, los dominios en Meta y el `CNAME` de Pages.
