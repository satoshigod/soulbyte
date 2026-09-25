'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import sitio from '../../sitio.config';
import { enviar, NEGOCIO, obtener, type MensajeChat } from './api';
import { enlaceWhatsApp } from './formato';
import { rastrear } from './medicion';
import { cx, Icono } from './ui';

/**
 * Chat del sitio: habla con el mismo asistente y llega a la misma Bandeja que WhatsApp.
 * El visitante recibe una clave (token) que se guarda en su navegador; cuando una persona del equipo
 * responde desde el panel, el sitio la muestra aquí (consulta cada pocos segundos mientras el chat está abierto).
 */

const CLAVE = `sb_chat_${NEGOCIO}`;

export function ChatWeb({ negocio, whatsapp }: { negocio: string; whatsapp: string | null }) {
  const [abierto, setAbierto] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return typeof window === 'undefined' ? null : localStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  });
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<string>('open');
  const [noLeidos, setNoLeidos] = useState(0);
  const fin = useRef<HTMLDivElement>(null);
  const primero = useRef(true);

  const agregar = useCallback((nuevos: MensajeChat[]) => {
    if (!nuevos.length) return;
    setMensajes((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const extra = nuevos.filter((m) => !ids.has(m.id));
      return extra.length ? [...prev, ...extra] : prev;
    });
  }, []);

  // Historial al abrir con clave guardada.
  useEffect(() => {
    if (!token || !abierto || !primero.current) return;
    primero.current = false;
    obtener<{ estado: string; mensajes: MensajeChat[] }>(`chat?token=${token}`).then((r) => {
      if (r.ok) {
        // El primer «hola» lo manda el sitio al abrir el chat, no la persona: no se muestra.
        const lista = r.mensajes[0]?.de === 'visitante' && r.mensajes[0].texto?.toLowerCase() === 'hola' ? r.mensajes.slice(1) : r.mensajes;
        agregar(lista);
        setEstado(r.estado);
      }
    });
  }, [token, abierto, agregar]);

  // Respuestas del equipo mientras el chat está abierto.
  useEffect(() => {
    if (!token || !abierto) return;
    const id = setInterval(async () => {
      const ultimo = mensajes[mensajes.length - 1]?.en;
      const r = await obtener<{ estado: string; mensajes: MensajeChat[] }>(`chat?token=${token}${ultimo ? `&desde=${encodeURIComponent(ultimo)}` : ''}`);
      if (r.ok) {
        agregar(r.mensajes.filter((m) => m.de !== 'visitante'));
        setEstado(r.estado);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [token, abierto, mensajes, agregar]);

  useEffect(() => {
    if (abierto) fin.current?.scrollIntoView({ block: 'end' });
  }, [mensajes, abierto]);

  async function mandar(cuerpo: { texto?: string; opcion?: string }, silencioso = false) {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    const eco: MensajeChat | null = cuerpo.texto && !silencioso ? { id: `local-${Date.now()}`, de: 'visitante', texto: cuerpo.texto, encabezado: null, pie: null, opciones: [], tipo: 'text', en: new Date().toISOString() } : null;
    if (eco) setMensajes((p) => [...p, eco]);
    const r = await enviar<{ token: string; mensajes: MensajeChat[] }>('chat', { token, ...cuerpo });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    if (!token) {
      setToken(r.token);
      try {
        localStorage.setItem(CLAVE, r.token);
      } catch {
        /* sin almacenamiento */
      }
      rastrear('chat');
    }
    agregar(r.mensajes);
  }

  function abrir() {
    setAbierto(true);
    setNoLeidos(0);
    if (!token && !mensajes.length) void mandar({ texto: 'hola' }, true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    setTexto('');
    void mandar({ texto: t });
  }

  const ultimoConOpciones = [...mensajes].reverse().find((m) => m.opciones.length)?.id;

  return (
    <>
      <button
        type="button"
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primario px-5 py-3.5 font-display text-[15px] font-semibold text-white shadow-suave transition hover:bg-primario-2"
        aria-expanded={abierto}
        aria-controls="chat-sitio"
      >
        <Icono nombre={abierto ? 'cerrar' : 'chat'} size={20} />
        {abierto ? 'Cerrar' : 'Escríbenos'}
        {!abierto && noLeidos > 0 && <span className="ml-1 rounded-full bg-white px-2 text-xs text-primario">{noLeidos}</span>}
      </button>

      {abierto && (
        <section id="chat-sitio" aria-label={`Chat con ${negocio}`} className="fixed bottom-20 right-5 z-40 flex h-[min(600px,calc(100dvh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-grande border border-linea bg-white shadow-suave">
          <header className="flex items-center gap-3 border-b border-linea bg-fondo-suave px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primario text-white">
              <Icono nombre="chat" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate font-display text-[15px] font-semibold">{negocio}</p>
              <p className="m-0 text-xs text-tinta-3">{estado === 'pending' ? 'Una persona del equipo te responde pronto' : 'Asistente · responde al instante'}</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {mensajes.map((m) => (
              <article key={m.id} className={cx('mb-3 flex flex-col', m.de === 'visitante' ? 'items-end' : 'items-start')}>
                {m.encabezado && <p className="mb-0.5 text-xs font-semibold text-tinta-3">{m.encabezado}</p>}
                <div className={cx('max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug', m.de === 'visitante' ? 'bg-primario text-white' : 'bg-fondo-suave text-tinta')}>
                  {m.de === 'equipo' && <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-primario">Equipo</span>}
                  {m.texto}
                </div>
                {m.opciones.length > 0 && m.id === ultimoConOpciones && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.opciones.map((o) => (
                      <button key={o.id} type="button" disabled={enviando} onClick={() => mandar({ opcion: o.id })} className="rounded-full border border-linea-fuerte bg-white px-3 py-1.5 text-left text-[13px] leading-tight text-tinta hover:border-primario hover:text-primario-2" title={o.descripcion ?? undefined}>
                        {o.titulo}
                      </button>
                    ))}
                  </div>
                )}
                {m.pie && <p className="mt-1 text-[11px] text-tinta-3">{m.pie}</p>}
              </article>
            ))}
            {enviando && <p className="text-xs text-tinta-3">Escribiendo…</p>}
            {error && (
              <p className="rounded-caja bg-alerta-tenue px-3 py-2 text-[13px] text-alerta" role="alert">
                {error}
              </p>
            )}
            <div ref={fin} />
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-linea px-3 py-2.5">
            <label htmlFor="chat-texto" className="sr-only">
              Escribe tu mensaje
            </label>
            <input id="chat-texto" className="entrada py-2.5" placeholder="Escribe aquí…" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1000} autoComplete="off" />
            <button type="submit" disabled={enviando || !texto.trim()} className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primario text-white disabled:opacity-50" aria-label="Enviar">
              <Icono nombre="enviar" size={18} />
            </button>
          </form>
          {whatsapp && (
            <a href={enlaceWhatsApp(whatsapp, sitio.whatsappMensaje)} target="_blank" rel="noopener noreferrer" onClick={() => rastrear('whatsapp')} className="flex items-center justify-center gap-2 border-t border-linea bg-fondo-suave py-2 text-[13px] font-semibold text-primario no-underline">
              <Icono nombre="whatsapp" size={16} /> Seguir por WhatsApp
            </a>
          )}
        </section>
      )}
    </>
  );
}
