'use client';
import { useState } from 'react';
import { enviar } from '@/plataforma/api';
import { rastrear } from '@/plataforma/medicion';

const INTERESES = ['Agenda y recordatorios', 'Atención por WhatsApp', 'Cotizaciones y cobros', 'Correos y redes sociales', 'Otra cosa'];

type Props = {
  id?: string;
  titulo?: string;
  sub?: string;
  etiquetaInteres?: string;
  intereses?: string[];
  /** Primera línea del mensaje que llega a Solicitudes (por ejemplo, «Quiero crear la cuenta…»). */
  asunto?: string;
  /** Para crear una cuenta: el negocio y el correo son obligatorios (al correo llega el enlace de activación). */
  paraCuenta?: boolean;
  boton?: string;
  nota?: string;
  exito?: string;
  origen?: string;
};

/**
 * Formulario de solicitud del sitio (mismo marcado y clases del sitio estático): «Escríbenos» en la página de
 * servicios y la solicitud de cuenta en /crear-cuenta/. Llega a Solicitudes del panel de Soulbyte por la API
 * pública, con aviso al equipo.
 */
export function FormularioSolicitud({
  id = 'solicitud',
  titulo = 'Escríbenos',
  sub = 'Te respondemos por WhatsApp o, si lo prefieres, por correo.',
  etiquetaInteres = '¿Qué quieres automatizar?',
  intereses = INTERESES,
  asunto,
  paraCuenta = false,
  boton = 'Enviar',
  nota = 'Con tu celular te respondemos por WhatsApp.',
  exito = 'Recibimos tu solicitud. Te vamos a contactar pronto.',
  origen = 'servicios',
}: Props) {
  const [estado, setEstado] = useState<{ texto: string; error?: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [t0] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const v = (n: string) => String((f.elements.namedItem(n) as HTMLInputElement | null)?.value ?? '').trim();
    const marcado = (n: string) => Boolean((f.elements.namedItem(n) as HTMLInputElement | null)?.checked);
    if (v('nombre').length < 2) return setEstado({ texto: 'Escribe tu nombre.', error: true });
    if (paraCuenta && v('empresa_cliente').length < 2) return setEstado({ texto: 'Escribe el nombre de tu negocio.', error: true });
    if (v('telefono').replace(/\D/g, '').length < 10) return setEstado({ texto: 'Escribe tu celular completo, por ejemplo 300 123 4567.', error: true });
    if (paraCuenta && !v('email')) return setEstado({ texto: 'Escribe tu correo: allí te llega el enlace para activar tu cuenta.', error: true });
    if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) return setEstado({ texto: 'Revisa el correo.', error: true });
    if (!marcado('consentimiento')) return setEstado({ texto: 'Para responderte necesitamos tu autorización de tratamiento de datos.', error: true });
    if (v('_hp') || Date.now() - t0 < 1500) return setEstado({ texto: 'No pudimos enviar tu solicitud. Escríbenos a hola@soulbyte.app.', error: true });
    setEnviando(true);
    setEstado({ texto: 'Enviando…' });
    const mensaje = [asunto, `Interés: ${v('servicio')}`, v('mensaje')].filter(Boolean).join('\n');
    const r = await enviar<{ id: string }>('solicitudes', { nombre: v('nombre'), celular: v('telefono'), correo: v('email') || null, empresa: v('empresa_cliente') || null, autorizaDatos: true, recordatorios: marcado('whatsapp_optin'), promociones: false, mensaje });
    setEnviando(false);
    if (!r.ok) return setEstado({ texto: r.error, error: true });
    f.reset();
    setEstado({ texto: exito });
    rastrear('solicitud', { origen });
  }

  return (
    <form className="ficha" id={id} noValidate onSubmit={onSubmit}>
      <p className="ficha-titulo">{titulo}</p>
      <p className="ficha-sub">{sub}</p>
      <label htmlFor="s-nombre">Nombre</label>
      <input id="s-nombre" name="nombre" autoComplete="name" maxLength={120} required />
      <label htmlFor="s-empresa">
        {paraCuenta ? (
          'Nombre de tu negocio'
        ) : (
          <>
            Empresa <span className="opcional">(opcional)</span>
          </>
        )}
      </label>
      <input id="s-empresa" name="empresa_cliente" autoComplete="organization" maxLength={160} required={paraCuenta} />
      <label htmlFor="s-telefono">Celular</label>
      <input id="s-telefono" name="telefono" type="tel" autoComplete="tel" maxLength={40} required />
      <label htmlFor="s-email">
        Correo{' '}
        {!paraCuenta && <span className="opcional">(opcional)</span>}
      </label>
      <input id="s-email" name="email" type="email" autoComplete="email" maxLength={160} required={paraCuenta} />
      <label htmlFor="s-servicio">{etiquetaInteres}</label>
      <select id="s-servicio" name="servicio" defaultValue={intereses[0]}>
        {intereses.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <label htmlFor="s-mensaje">
        Cuéntanos más <span className="opcional">(opcional)</span>
      </label>
      <textarea id="s-mensaje" name="mensaje" maxLength={2000} />
      <div className="trampa" aria-hidden="true">
        <label htmlFor="s-web">No llenar</label>
        <input id="s-web" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="casilla">
        <input type="checkbox" name="consentimiento" required />
        <span id="s-consentimiento">
          Autorizo a Soulbyte S.A.S. a tratar mis datos para responder esta solicitud, según su <a href="/privacidad/">política de privacidad</a> (Ley 1581 de 2012).
        </span>
      </label>
      <label className="casilla">
        <input type="checkbox" name="whatsapp_optin" defaultChecked />
        <span>Pueden escribirme por WhatsApp sobre esta solicitud.</span>
      </label>
      <button className="boton" type="submit" disabled={enviando}>
        {boton}
      </button>
      <p className="nota">{nota}</p>
      <div className={`estado${estado ? ' visible' : ''}${estado?.error ? ' error' : ''}`} id="s-estado" role="status" aria-live="polite">
        {estado?.texto}
      </div>
    </form>
  );
}
