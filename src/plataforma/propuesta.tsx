'use client';
import { useEffect, useState } from 'react';
import { enviar, obtener, type Negocio, type Propuesta } from './api';
import { cop, fechaLarga } from './formato';
import { rastrear } from './medicion';
import { Aviso, Boton, Cargando, Icono } from './ui';

const ESTADO: Record<string, string> = { sent: 'Enviada', accepted: 'Aceptada', rejected: 'Rechazada', expired: 'Vencida' };

/** Propuesta comercial (motor de proyectos y casos) por su clave, con aceptación en línea. */
export function VerPropuesta({ negocio: n, token }: { negocio: Negocio; token: string }) {
  const [p, setP] = useState<Propuesta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [acepto, setAcepto] = useState(false);

  async function cargar() {
    const r = await obtener<{ propuesta: Propuesta }>(`propuestas/${token}`);
    if (r.ok) setP(r.propuesta);
    else setError(r.error);
  }
  useEffect(() => {
    let activo = true;
    obtener<{ propuesta: Propuesta }>(`propuestas/${token}`).then((r) => {
      if (!activo) return;
      if (r.ok) setP(r.propuesta);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [token]);

  async function aceptar() {
    if (!acepto) return setError('Marca la casilla para aceptar la propuesta.');
    setOcupado(true);
    setError(null);
    const r = await enviar<{ id: string; proyectoId: string }>(`propuestas/${token}/aceptar`, {});
    setOcupado(false);
    if (!r.ok) return setError(r.error);
    setAviso('Propuesta aceptada. El equipo te escribe para arrancar.');
    rastrear('propuesta_aceptada', { codigo: p?.codigo, valor: p?.total });
    await cargar();
  }

  if (error && !p) return <Aviso tipo="error">{error}</Aviso>;
  if (!p) return <Cargando texto="Buscando la propuesta…" />;
  const v = n.perfil.vocabulario;
  return (
    <div className="flex max-w-[760px] flex-col gap-4">
      {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
      {error && <Aviso tipo="error">{error}</Aviso>}
      <article className="tarjeta">
        <p className="eyebrow !mb-1">
          {p.codigo} · {ESTADO[p.estado] ?? p.estado}
        </p>
        <h2 className="!mb-1">{p.titulo}</h2>
        <p className="m-0 text-tinta-2">
          Para {p.cliente}
          {p.empresa && p.empresa !== p.cliente ? ` · ${p.empresa}` : ''}
          {p.vigenteHasta ? ` · vigente hasta el ${fechaLarga(p.vigenteHasta)}` : ''}
        </p>
        {p.descripcion && <p className="mb-0 mt-3 whitespace-pre-line">{p.descripcion}</p>}
      </article>
      {p.items.length > 0 && (
        <article className="tarjeta">
          <h3>Alcance y valor</h3>
          <table className="w-full border-collapse text-[15px]">
            <tbody>
              {p.items.map((it, i) => (
                <tr key={i} className="border-b border-linea">
                  <td className="py-1.5">
                    {it.label}
                    {it.qty > 1 ? ` × ${it.qty}` : ''}
                  </td>
                  <td className="py-1.5 text-right">{cop(it.price * it.qty)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-display font-semibold">Total</td>
                <td className="py-2 text-right font-display font-semibold">{cop(p.total)}</td>
              </tr>
            </tbody>
          </table>
        </article>
      )}
      {p.abierta ? (
        <div className="tarjeta flex flex-col gap-3">
          <label className="flex items-start gap-2 text-[15px] leading-snug">
            <input type="checkbox" className="mt-1" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
            <span>
              Acepto esta propuesta de {p.negocio} por {cop(p.total)} y autorizo iniciar el {v.trabajo[0]}.
            </span>
          </label>
          <Boton onClick={aceptar} disabled={ocupado} className="self-start">
            Aceptar propuesta <Icono nombre="check" size={18} />
          </Boton>
        </div>
      ) : (
        <Aviso>{p.estado === 'accepted' ? 'Esta propuesta ya fue aceptada. ¡Gracias!' : 'Esta propuesta ya no está abierta. Si quieres retomarla, escríbenos.'}</Aviso>
      )}
    </div>
  );
}
