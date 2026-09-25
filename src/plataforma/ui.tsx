import Link from 'next/link';
import type { ReactNode } from 'react';

/** Piezas de interfaz de las páginas de la plataforma. Usan solo las variables de la marca. */

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

type BotonProps = {
  href?: string;
  children: ReactNode;
  variante?: 'primario' | 'secundario';
  chico?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  externo?: boolean;
};

export function Boton({ href, children, variante = 'primario', chico, className, type = 'button', disabled, onClick, externo }: BotonProps) {
  const cls = cx('boton', variante === 'primario' ? 'boton-primario' : 'boton-secundario', chico && 'boton-chico', className);
  if (href && !disabled) {
    if (externo || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a className={cls} href={href} target={externo ? '_blank' : undefined} rel={externo ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function Campo({ etiqueta, htmlFor, ayuda, children, className }: { etiqueta: string; htmlFor?: string; ayuda?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx('campo', className)} htmlFor={htmlFor}>
      <span>{etiqueta}</span>
      {children}
      {ayuda && <small className="text-tinta-3">{ayuda}</small>}
    </label>
  );
}

export function Aviso({ tipo = 'info', children }: { tipo?: 'info' | 'error' | 'ok'; children: ReactNode }) {
  const cls = tipo === 'error' ? 'bg-alerta-tenue text-alerta' : tipo === 'ok' ? 'bg-exito-tenue text-exito' : 'bg-fondo-suave text-tinta-2';
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={cx('rounded-caja px-4 py-3 text-[15px] leading-snug', cls)}>
      {children}
    </div>
  );
}

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <p className="flex items-center gap-2 text-tinta-3" role="status">
      <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-linea-fuerte border-t-primario" />
      {texto}
    </p>
  );
}

export function Encabezado({ eyebrow, titulo, texto, children }: { eyebrow?: string; titulo: string; texto?: string; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-[70ch]">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mb-3">{titulo}</h1>
      {texto && <p className="lead">{texto}</p>}
      {children}
    </header>
  );
}

export function Seccion({ id, children, className, suave }: { id?: string; children: ReactNode; className?: string; suave?: boolean }) {
  return (
    <section id={id} className={cx('py-14 md:py-20', suave && 'bg-fondo-suave', className)}>
      <div className="envoltura">{children}</div>
    </section>
  );
}

/** Íconos de trazo, sin dependencias. */
export function Icono({ nombre, size = 20, className }: { nombre: 'check' | 'flecha' | 'chat' | 'whatsapp' | 'calendario' | 'reloj' | 'pin' | 'cerrar' | 'enviar' | 'usuario' | 'menu' | 'estrella' | 'volver'; size?: number; className?: string }) {
  const paths: Record<string, ReactNode> = {
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
    volver: <path d="M19 12H5M11 6l-6 6 6 6" />,
    chat: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.6A7.5 7.5 0 1 1 20 11.5z" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20 11.6a8 8 0 0 1-11.7 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.6z" />
        <path d="M9.2 8.8c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .4.5.9 1.4 1.8 2.4 2.3.2.1.3.1.4 0l.7-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5-.1.8-.7 1.5-1.6 1.6-1.4.2-3.3-.9-4.6-2.3-1.2-1.3-2-2.8-1.9-4.1 0-.4.2-.7.4-.9z" />
      </>
    ),
    calendario: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </>
    ),
    reloj: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    cerrar: <path d="M6 6l12 12M18 6L6 18" />,
    enviar: <path d="M21 3.5L10.5 14M21 3.5l-6.5 17-4-6.5-6.5-4z" />,
    usuario: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c.7-3.6 3.4-5.5 7-5.5s6.3 1.9 7 5.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    estrella: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z" />,
  };
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[nombre]}
    </svg>
  );
}
