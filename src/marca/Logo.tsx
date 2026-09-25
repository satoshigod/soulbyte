import Image from 'next/image';
import sitio from '../../sitio.config';

/** Logo de la marca en la cabecera y el pie. Cambia la imagen en /public y, si hace falta, este componente. */
export function Logo({ nombre, claro }: { nombre: string; claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
      <Image src={sitio.marca.logo} alt="" width={36} height={36} className="h-9 w-9 rounded-[10px]" priority />
      <span className={claro ? 'text-white' : 'text-tinta'}>{nombre}</span>
    </span>
  );
}
