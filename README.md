# Soulbyte — sitio y onboarding de WhatsApp (Tech Provider de Meta)

Sitio estático servido por GitHub Pages desde `main` (raíz): https://satoshigod.github.io/soulbyte/

| Ruta | Qué es |
|---|---|
| `index.html` | Presentación de Soulbyte como proveedor tecnológico de e-commerce. Sección `#motor-propio` (21-sep-2026): los cuatro diferenciadores frente a una tienda alquilada — motor multimarca con canal mayorista, reglas propias en carrito y pago, sin comisión de plataforma por venta, sitio y datos del comercio — más tabla comparativa con datos públicos de Shopify verificados ese día (comisión por pasarela externa 2 %/1 %/0,6 %/0,2 % según plan; Shopify Payments no opera en Colombia; B2B nativo en todos los planes desde abril de 2026 con tope de 3 catálogos; Plus desde USD 2.300/mes) y FAQ «¿Por qué no simplemente Shopify?». Si Shopify cambia precios o alcance, actualizar tabla, nota y FAQ. Acreditaciones: Tech Provider de WhatsApp Business (App Review aprobado el 12-sep-2026, app "Soulbyte n8n" 1781576016329423, empresa Soulbyte S.A.S. 576096632544762 verificada) y cuenta avanzada de Google Merchant Center (aprobada el 3-sep-2026, cuenta principal 5847345525; subcuentas Hit-Air Colombia 5848128866 y Ekivibes 5847731944). |
| `conectar/` | Conexión de WhatsApp Business para comercios, con dos vías: **registro guiado por Meta** (hosted Embedded Signup, `hosted_url`) y **registro integrado** (Embedded Signup v4 con el SDK JS, `config_id`). La página obtiene la configuración de n8n; nunca ve el App Secret ni tokens. |
| `privacidad/` | Política de privacidad de la plataforma. |
| `assets/onboarding.js` | Lógica de las dos vías: lead + apertura del registro de Meta; SDK de Meta, evento `WA_EMBEDDED_SIGNUP`, `FB.login` con `response_type: 'code'`. |
| `robots.txt`, `sitemap.xml` | Indexación. |

## Backend (n8n, `https://n8n.hitaircolombia.com`)

Workflow **"Soulbyte — onboarding WhatsApp de comercios (Embedded Signup, Tech Provider)"** (`va7vfi9YbATCZFlf`):

- `GET /webhook/soulbyte-onboarding-config` → `{app_id, config_id, version, habilitado, hosted_url, habilitado_hosted}` leído de NocoDB `parametros` (`meta_app_id`, `meta_es_config_id`, `meta_graph_version`, `meta_hosted_onboarding_url`). CORS restringido a `https://satoshigod.github.io`.
  - `habilitado` = hay `config_id` → se muestra el botón del registro integrado (SDK).
  - `habilitado_hosted` = hay `hosted_url` → se activa el botón "Empezar el registro en Meta".
- `POST /webhook/soulbyte-onboarding-lead` `{via, empresa, contacto_*, sitio_web}` → guarda/actualiza el comercio en NocoDB `tenants` (`m9flo5er05seh7b`) con `origen=hosted_signup`, `estado=lead`, y avisa al equipo (correo). Es lo que usa la vía guiada por Meta antes de abrir `hosted_url`.
- `POST /webhook/soulbyte-onboarding` `{code, waba_id, phone_number_id, business_id, event, empresa, contacto_*, sitio_web}` (vía integrada) →
  1. valida y genera `clave` + PIN de 6 dígitos;
  2. `GET /oauth/access_token` (client_secret desde la credencial n8n **"Meta — App Secret (Soulbyte n8n, query client_secret)"**) → business token;
  3. `POST /{waba_id}/subscribed_apps`;
  4. `GET /{phone_number_id}` y `GET /{waba_id}`;
  5. `POST /{phone_number_id}/register` solo si el número **no** está ya en Cloud API conectado;
  6. upsert en NocoDB `tenants` por `waba_id`;
  7. aviso interno por el portero del equipo y respuesta JSON a la página.

Tenant 1 (`clave=soulbyte`) es la operación propia: su token vive en el vault de n8n, no en la tabla.

## Vía guiada por Meta (hosted Embedded Signup): cómo se completa un comercio

1. El comercio termina el registro en la página de Meta → Meta comparte su WABA con la app y envía el webhook `account_update` con `event=PARTNER_ADDED` (`waba_info.waba_id`, `owner_business_id`).
2. Con el token de usuario del sistema + `appsecret_proof`, `GET /{owner_business_id}/system_user_access_tokens?fetch_only=true` → business token del comercio.
3. `GET /{waba_id}/phone_numbers` → `phone_number_id`; luego `subscribed_apps` y `register` como en la vía integrada; upsert en `tenants` por `waba_id` (cruzar con el lead por correo/empresa).
4. El comercio debe añadir método de pago a su WABA (Meta le factura a él).

## Configuración en el panel de Meta (app "Soulbyte n8n" 1781576016329423)

- **Casos de uso → WhatsApp → Personalizar → Conviértete en proveedor de tecnología**: "2 de 2 pasos completados". La URL de **Proceso sin integración** es `hosted_url` → guardarla en NocoDB `parametros.meta_hosted_onboarding_url`.
- Para la vía integrada (opcional): **Inicio de sesión con Facebook para empresas → Configuración**: dominio permitido para el SDK `satoshigod.github.io`, URI de redirección `https://satoshigod.github.io/soulbyte/conectar/`; **Configuraciones → Crear a partir de plantilla → WhatsApp Embedded Signup** → copiar el ID a `parametros.meta_es_config_id`; **Configuración de la app → Básica → Dominios de la app**: `satoshigod.github.io`.
- **WhatsApp → Configuración → Webhooks**: suscribir `account_update` (además de `messages`).

Cuando el dominio definitivo exista, cambiar: `allowedOrigins` de los nodos Webhook, los dominios en Meta, el `CNAME` de Pages y las URLs canónicas.
