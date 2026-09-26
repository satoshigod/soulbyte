'use client';
import { useState } from 'react';
import { enviar, type Negocio, type Servicio } from './api';
import { rastrear } from './medicion';
import { cuerpoPersona, DatosPersona, usePersona, validarPersona } from './persona';
import { Aviso, Boton, Campo, Icono } from './ui';

/** Formulario de contacto: llega a Solicitudes del panel y avisa al equipo (correo y WhatsApp). */
export function FormularioContacto({ negocio: n, servicios, asunto }: { negocio: Negocio; servicios: Servicio[]; asunto?: string | null }) {
  const v = n.perfil.vocabulario;
  const { persona, cambiar } = usePersona();
  const [servicioId, setServicioId] = useState('');
  const [mensaje, setMensaje] = useState(asunto ? `${asunto}\n` : '');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const empresa = n.perfil.rasgos.includes('empresa');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validarPersona(persona);
    if (err) return setError(err);
    if (mensaje.trim().length < 3 && !servicioId) return setError('Cuéntanos qué necesitas.');
    setEnviando(true);
    setError(null);
    const r = await enviar<{ id: string }>('solicitudes', { ...cuerpoPersona(persona), servicioId: servicioId || null, mensaje: mensaje.trim() || null });
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setListo(true);
    rastrear('solicitud', { servicio: servicios.find((s) => s.id === servicioId)?.nombre ?? null });
  }

  if (listo) {
    return (
      <div className="tarjeta max-w-[560px] shadow-suave">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-exito-tenue text-exito">
          <Icono nombre="check" size={26} />
        </span>
        <h2 className="!mb-2">Recibimos tu mensaje</h2>
        <p className="text-tinta-2">{n.nombre} te responde por WhatsApp{persona.correo ? ' o correo' : ''} en horario de atención.</p>
        <Boton href="/" variante="secundario">
          Volver al inicio
        </Boton>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[720px] flex-col gap-5">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <DatosPersona persona={persona} cambiar={cambiar} negocio={n.nombre} politicaDatos={n.politicaDatos} conEmpresa={empresa} prefijo="c" />
      {servicios.length > 0 && (
        <Campo etiqueta={`¿Sobre qué ${v.servicio[0]}? (opcional)`} htmlFor="c-servicio" className="max-w-md">
          <select id="c-servicio" className="entrada" value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
            <option value="">Elegir…</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </Campo>
      )}
      <Campo etiqueta="¿Qué necesitas?" htmlFor="c-mensaje">
        <textarea id="c-mensaje" className="entrada" rows={4} maxLength={1500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder={n.perfil.motor === 'proyectos' ? 'Cuéntanos qué quieres lograr, para cuándo y cualquier detalle que ayude.' : n.perfil.motor === 'marca' ? 'Cuéntame de tu empresa o tu marca, qué buscas (charla, taller, consultoría, colaboración) y para cuándo.' : 'Cuéntanos qué necesitas.'} />
      </Campo>
      <Boton type="submit" disabled={enviando} className="self-start">
        {enviando ? 'Enviando…' : 'Enviar'} <Icono nombre="flecha" size={18} />
      </Boton>
    </form>
  );
}
