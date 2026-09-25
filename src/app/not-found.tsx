import { Contenido } from '@/contenido/no-encontrada';
import { meta } from '@/plataforma/seo';

export const metadata = meta({ titulo: 'Página no encontrada', ruta: '/404', noIndex: true });

export default function NoEncontrada() {
  return <Contenido />;
}
