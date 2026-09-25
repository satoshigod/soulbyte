import { Contenido, jsonld, metadatos } from '@/contenido/automatizacion-empresas-de-servicios';
import { JsonLd, meta } from '@/plataforma/seo';

export const metadata = meta({ tituloCompleto: metadatos.titulo, descripcion: metadatos.descripcion, ogTitulo: metadatos.ogTitulo, ogDescripcion: metadatos.ogDescripcion, ruta: metadatos.ruta, noIndex: metadatos.noIndex, imagen: '/assets/og-soulbyte.jpg?v=2' });

export default function Pagina() {
  return (
    <>
      {jsonld.map((d, i) => (
        <JsonLd key={i} datos={d} />
      ))}
      <Contenido />
    </>
  );
}
