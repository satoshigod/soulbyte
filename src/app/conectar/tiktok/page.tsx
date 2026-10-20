import Script from 'next/script';
import sitio from '../../../../sitio.config';
import { Contenido, jsonld, metadatos } from '@/contenido/conectar-tiktok';
import { JsonLd, meta } from '@/plataforma/seo';

export const metadata = meta({ tituloCompleto: metadatos.titulo, descripcion: metadatos.descripcion, ogTitulo: metadatos.ogTitulo, ogDescripcion: metadatos.ogDescripcion, ruta: metadatos.ruta, noIndex: metadatos.noIndex, imagen: '/assets/og-soulbyte.jpg?v=2' });

// Esta es la dirección de regreso registrada en la app de TikTok. Cuando la autorización empezó en el panel de la
// plataforma (Redes → TikTok), el `state` empieza con «sbapp1.» y la plataforma termina la conexión: se le pasa la
// consulta tal cual, antes de que cargue nada más, y se quita de la barra de direcciones para que el código de un
// solo uso no quede en la medición ni en el origen de la visita.
const VOLVER = `${sitio.plataforma.replace(/\/$/, '')}/redes/tiktok/volver`;
const PASAR_A_LA_PLATAFORMA = `(function(){try{var q=location.search;if((new URLSearchParams(q).get('state')||'').indexOf('sbapp1.')!==0)return;try{history.replaceState(null,'',location.pathname)}catch(e){}location.replace(${JSON.stringify(VOLVER)}+q)}catch(e){}})();`;

export default function Pagina() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PASAR_A_LA_PLATAFORMA }} />
      {jsonld.map((d, i) => (
        <JsonLd key={i} datos={d} />
      ))}
      <Script src="/assets/tiktok-conexion.js" strategy="afterInteractive" />
      <Contenido />
    </>
  );
}
