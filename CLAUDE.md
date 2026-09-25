# Reglas para trabajar en este repositorio

- Es soulbyte.app sobre la plantilla `satoshigod/sitio-cliente` (Next.js), conectado al negocio «Soulbyte» de la plataforma (app.soulbyte.app). Todo en español de Colombia: textos, comentarios y commits. Un commit atómico por cambio, con autor Ivan Correa <hola@soulbyte.app>.
- `src/plataforma/` es la conexión con la plataforma y es igual en todos los sitios: no se personaliza aquí; para actualizarla se copia la carpeta desde la plantilla. Lo propio del sitio vive en `sitio.config.ts`, `src/marca/`, `src/contenido/`, `src/app/` y `public/`.
- El contenido de cada página está en `src/contenido/<página>.tsx` (JSX portado del sitio estático): al editar, cerrar las etiquetas, usar `className` y `{'…'}` para llaves. Los metadatos y el JSON-LD de cada página van en el mismo archivo.
- Solo se publica lo que corre en producción; lo que dependa de una aprobación de Meta o Google va en la nota de la sección. El sitio no menciona Wompi ni Addi. Toda ilustración con cifras lleva la leyenda «datos de ejemplo».
- Los datos de Soulbyte como negocio (servicios, horario, equipo, redes, política de datos) se cambian en el panel, no en el código: el sitio los lee de la API pública.
- Ningún secreto en el repositorio. Los scripts de `public/assets/` hablan con n8n solo por webhooks públicos.
- Antes de publicar: `npm run typecheck`, `npm run lint`, `npm run build` y revisar a 1280 y 390 px (menús «E-commerce» y «Servicios» con ratón, teclado y en móvil).
