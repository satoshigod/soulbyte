'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Cabecera de soulbyte.app: barra fija con los menús «E-commerce» y «Servicios», enlaces y acciones.
 * Mismo marcado y clases del sitio anterior (assets/soulbyte.css); la lógica del menú y los desplegables
 * ahora vive aquí (solo uno abierto a la vez; se cierran con clic afuera, Escape, foco fuera o al elegir).
 */

type Entrada = { href: string; icono: string; titulo: string; texto: string; clase?: string };

const ECOMMERCE: Entrada[] = [
  { href: '/#que-incluye', icono: 'i-tienda', titulo: 'Plataforma', texto: 'Tienda propia, inventario y operación' },
  { href: '/whatsapp-business-api/', icono: 'i-chat', titulo: 'WhatsApp Business', texto: 'Autoservicio, catálogo y pago desde el chat' },
  { href: '/#meta', icono: 'i-grafico', titulo: 'Meta', texto: 'Medición, públicos y anuncios vigilados' },
  { href: '/#instagram', icono: 'i-imagen', titulo: 'Instagram', texto: 'Publicaciones, comentarios y mensajes directos' },
  { href: '/google-merchant-center/', icono: 'i-buscar', titulo: 'Google', texto: 'Merchant Center y Perfil de Negocio' },
  { href: '/ecommerce-b2b-mayoristas/', icono: 'i-porcentaje', titulo: 'Mayoristas B2B', texto: 'Listas de precios, cotizaciones y cartera' },
  { href: '/#dropshipping', icono: 'i-cajas', titulo: 'Dropshipping', texto: 'Una tienda por producto, un solo inventario' },
  { href: '/importacion-y-logistica/', icono: 'i-globo', titulo: 'Importación y logística', texto: 'Compra, aduana y transporte con TCC' },
  { href: '/vender-en-colombia/', icono: 'i-bandera', titulo: 'Vender en Colombia', texto: 'Marcas del exterior: prueba de mercado sin abrir empresa', clase: 'fila-completa' },
];

const SERVICIOS: Entrada[] = [
  { href: '/automatizacion-empresas-de-servicios/', icono: 'i-rayo', titulo: 'Empresas de servicios', texto: 'Agenda, WhatsApp, cobros y redes automatizados' },
  { href: '/automatizacion-empresas-de-servicios/#desarrollo', icono: 'i-capas', titulo: 'Desarrollo y agencias', texto: 'Solicitudes, propuestas y avance de proyectos' },
  { href: '/automatizacion-empresas-de-servicios/#salud', icono: 'i-calendario', titulo: 'Salud', texto: 'Citas, recordatorios y encuestas' },
  { href: '/automatizacion-empresas-de-servicios/#abogados', icono: 'i-escudo', titulo: 'Abogados y firmas', texto: 'Casos, agenda y documentos' },
  { href: '/reservar/', icono: 'i-calendario', titulo: 'Agenda una llamada', texto: 'Diagnóstico o demostración de la plataforma' },
];

const VENTAS = 'mailto:hola@soulbyte.app?subject=Quiero%20vender%20en%20l%C3%ADnea%20con%20Soulbyte';

function Desplegable({ id, titulo, entradas, dosCol, abierto, alternar, cerrar }: { id: string; titulo: string; entradas: Entrada[]; dosCol?: boolean; abierto: boolean; alternar: () => void; cerrar: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`desplegable${abierto ? ' abierto' : ''}`}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node | null)) cerrar();
      }}
    >
      <button
        className="desplegable-boton"
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={alternar}
      >
        {titulo}
        <svg className="ico" aria-hidden="true">
          <use href="#i-chevron" />
        </svg>
      </button>
      <div className="desplegable-panel" id={id}>
        <p className="desplegable-titulo">{titulo}</p>
        <div className={`desplegable-lista${dosCol ? ' dos-col' : ''}`}>
          {entradas.map((e) => (
            <a
              key={e.href}
              className={e.clase}
              href={e.href}
              onClick={() => {
                cerrar();
                (document.activeElement as HTMLElement | null)?.blur();
              }}
            >
              <span className="icono-mini" aria-hidden="true">
                <svg className="ico">
                  <use href={`#${e.icono}`} />
                </svg>
              </span>
              <span>
                <b>{e.titulo}</b>
                <small>{e.texto}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Cabecera() {
  const ruta = usePathname();
  const enConectar = ruta.startsWith('/conectar');
  const conectar = enConectar && !ruta.startsWith('/conectar/tiktok') ? '#ficha' : '/conectar/';
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplegable, setDesplegable] = useState<'ecommerce' | 'servicios' | null>(null);

  useEffect(() => {
    // Clic fuera de los desplegables: se cierran (dentro, cada botón decide).
    const clic = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('.desplegable')) return;
      setDesplegable(null);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDesplegable(null);
      setMenuAbierto(false);
    };
    document.addEventListener('click', clic);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('click', clic);
      document.removeEventListener('keydown', tecla);
    };
  }, []);

  return (
    <>
      <a className="salto" href="#contenido">
        Ir al contenido
      </a>
      <aside className="anuncio" aria-label="Aviso">
        Soulbyte es proveedor de tecnología de WhatsApp Business acreditado por Meta · {enConectar ? <a href="/whatsapp-business-api/">Qué incluye →</a> : <a href="/conectar/">Conecta tu número →</a>}
      </aside>
      <header className="sitio">
        <div className="envoltura">
          <a className="marca" href="/" aria-label="Soulbyte, inicio">
            <span className="isotipo" aria-hidden="true">
              s
            </span>
            <span>
              soul<b>byte</b>
            </span>
          </a>
          <nav className={`menu${menuAbierto ? ' abierto' : ''}`} id="menu" aria-label="Principal" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setMenuAbierto(false); }}>
            <Desplegable id="menu-ecommerce" titulo="E-commerce" entradas={ECOMMERCE} dosCol abierto={desplegable === 'ecommerce'} alternar={() => setDesplegable((d) => (d === 'ecommerce' ? null : 'ecommerce'))} cerrar={() => setDesplegable((d) => (d === 'ecommerce' ? null : d))} />
            <Desplegable id="menu-servicios" titulo="Servicios" entradas={SERVICIOS} abierto={desplegable === 'servicios'} alternar={() => setDesplegable((d) => (d === 'servicios' ? null : 'servicios'))} cerrar={() => setDesplegable((d) => (d === 'servicios' ? null : d))} />
            <a href="/#motor-propio">Por qué Soulbyte</a>
            <a href="/#preguntas">Preguntas</a>
            <a className="solo-movil" href={VENTAS}>
              Hablar con ventas
            </a>
            <a className="solo-movil btn btn-primario" href={conectar}>
              Conectar WhatsApp
            </a>
          </nav>
          <div className="acciones-barra">
            <a className="enlace" href={VENTAS}>
              Hablar con ventas
            </a>
            <a className="btn btn-primario btn-chico" href={conectar}>
              Conectar WhatsApp
            </a>
            <button
              className="nav-toggle"
              type="button"
              aria-controls="menu"
              aria-expanded={menuAbierto}
              aria-label={menuAbierto ? 'Cerrar el menú' : 'Abrir el menú'}
              onClick={() => {
                setMenuAbierto((v) => !v);
                setDesplegable(null);
              }}
            >
              <svg className="ico">
                <use href="#i-menu" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
