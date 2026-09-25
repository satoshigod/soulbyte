'use client';
import { useState } from 'react';
import { Campo } from './ui';

/**
 * Datos de la persona que reserva, cotiza o escribe: los mismos campos en todos los formularios,
 * con la autorización de tratamiento de datos (Ley 1581) y las casillas de recordatorios y promociones.
 */
export type Persona = {
  nombre: string;
  celular: string;
  correo: string;
  empresa: string;
  direccion: string;
  autorizaDatos: boolean;
  recordatorios: boolean;
  promociones: boolean;
};

export const PERSONA_VACIA: Persona = { nombre: '', celular: '', correo: '', empresa: '', direccion: '', autorizaDatos: false, recordatorios: true, promociones: false };

export function usePersona() {
  const [persona, setPersona] = useState<Persona>(PERSONA_VACIA);
  const cambiar = (k: keyof Persona, v: string | boolean) => setPersona((p) => ({ ...p, [k]: v }));
  return { persona, cambiar };
}

/** Revisa los datos antes de enviar; devuelve el primer error o null. */
export function validarPersona(p: Persona, opciones: { correoObligatorio?: boolean } = {}): string | null {
  if (p.nombre.trim().length < 2) return 'Escribe tu nombre.';
  if (p.celular.replace(/\D/g, '').length < 10) return 'Escribe tu celular completo, por ejemplo 300 123 4567.';
  if (p.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.correo.trim())) return 'Revisa el correo.';
  if (opciones.correoObligatorio && !p.correo) return 'Escribe tu correo.';
  if (!p.autorizaDatos) return 'Para continuar necesitamos tu autorización de tratamiento de datos.';
  return null;
}

/** Lo que se manda a la plataforma. */
export function cuerpoPersona(p: Persona) {
  return {
    nombre: p.nombre.trim(),
    celular: p.celular.trim(),
    correo: p.correo.trim() || null,
    empresa: p.empresa.trim() || null,
    direccion: p.direccion.trim() || null,
    autorizaDatos: true,
    recordatorios: p.recordatorios,
    promociones: p.promociones,
  };
}

export function DatosPersona({
  persona,
  cambiar,
  negocio,
  politicaDatos,
  conEmpresa,
  conDireccion,
  conCorreo = true,
  correoObligatorio,
  prefijo = 'p',
}: {
  persona: Persona;
  cambiar: (k: keyof Persona, v: string | boolean) => void;
  negocio: string;
  politicaDatos: string | null;
  conEmpresa?: boolean;
  conDireccion?: boolean;
  conCorreo?: boolean;
  correoObligatorio?: boolean;
  prefijo?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo etiqueta="Nombre" htmlFor={`${prefijo}-nombre`}>
        <input id={`${prefijo}-nombre`} className="entrada" autoComplete="name" maxLength={120} required value={persona.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
      </Campo>
      <Campo etiqueta="Celular" htmlFor={`${prefijo}-celular`} ayuda="Te escribimos por WhatsApp a este número.">
        <input id={`${prefijo}-celular`} className="entrada" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} required placeholder="300 123 4567" value={persona.celular} onChange={(e) => cambiar('celular', e.target.value)} />
      </Campo>
      {conCorreo && (
        <Campo etiqueta={correoObligatorio ? 'Correo' : 'Correo (opcional)'} htmlFor={`${prefijo}-correo`} ayuda={correoObligatorio ? undefined : 'Para enviarte la confirmación por escrito.'}>
          <input id={`${prefijo}-correo`} className="entrada" type="email" autoComplete="email" maxLength={160} required={correoObligatorio} value={persona.correo} onChange={(e) => cambiar('correo', e.target.value)} />
        </Campo>
      )}
      {conEmpresa && (
        <Campo etiqueta="Empresa (opcional)" htmlFor={`${prefijo}-empresa`}>
          <input id={`${prefijo}-empresa`} className="entrada" autoComplete="organization" maxLength={160} value={persona.empresa} onChange={(e) => cambiar('empresa', e.target.value)} />
        </Campo>
      )}
      {conDireccion && (
        <Campo etiqueta="Dirección" htmlFor={`${prefijo}-direccion`} className="sm:col-span-2" ayuda="Donde se presta el servicio.">
          <input id={`${prefijo}-direccion`} className="entrada" autoComplete="street-address" maxLength={200} value={persona.direccion} onChange={(e) => cambiar('direccion', e.target.value)} />
        </Campo>
      )}
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="flex items-start gap-2 text-[15px] leading-snug">
          <input type="checkbox" className="mt-1" checked={persona.autorizaDatos} onChange={(e) => cambiar('autorizaDatos', e.target.checked)} required />
          <span>
            Autorizo a {negocio} a tratar mis datos para atenderme y enviarme la información de este trámite
            {politicaDatos ? (
              <>
                , según su{' '}
                <a href={politicaDatos} target="_blank" rel="noopener noreferrer">
                  política de tratamiento de datos
                </a>
              </>
            ) : (
              ''
            )}
            . *
          </span>
        </label>
        <label className="flex items-start gap-2 text-[15px] leading-snug">
          <input type="checkbox" className="mt-1" checked={persona.recordatorios} onChange={(e) => cambiar('recordatorios', e.target.checked)} />
          <span>Quiero recibir recordatorios por WhatsApp y correo.</span>
        </label>
        <label className="flex items-start gap-2 text-[15px] leading-snug">
          <input type="checkbox" className="mt-1" checked={persona.promociones} onChange={(e) => cambiar('promociones', e.target.checked)} />
          <span>Quiero recibir novedades y promociones (puedes cancelarlo cuando quieras).</span>
        </label>
      </div>
    </div>
  );
}
