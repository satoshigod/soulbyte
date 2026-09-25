'use client';
import { useEffect, useState } from 'react';
import { enviar, obtener, type Negocio, type Orden, type Servicio } from './api';
import { cop, fechaLarga } from './formato';
import { rastrear } from './medicion';
import { cuerpoPersona, DatosPersona, usePersona, validarPersona } from './persona';
import { Aviso, Boton, Campo, Cargando, Icono } from './ui';

/** Pedir cotización o visita (motor de órdenes de trabajo): crea la orden en el panel y avisa al equipo. */
export function FormularioCotizacion({ negocio: n, servicios }: { negocio: Negocio; servicios: Servicio[] }) {
  const v = n.perfil.vocabulario;
  const { persona, cambiar } = usePersona();
  const [descripcion, setDescripcion] = useState('');
  const [bien, setBien] = useState('');
  const [servicioId, setServicioId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<{ codigo: string; token: string } | null>(null);
  const vehiculo = n.perfil.rasgos.includes('bien:vehiculo');
  const equipo = n.perfil.rasgos.includes('bien:equipo');
  const domicilio = n.perfil.rasgos.includes('bien:direccion') || n.perfil.rasgos.includes('domicilio');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validarPersona(persona);
    if (err) return setError(err);
    if (descripcion.trim().length < 5) return setError('Cuéntanos qué necesitas.');
    setEnviando(true);
    setError(null);
    const r = await enviar<{ id: string; codigo: string; token: string }>('ordenes', { ...cuerpoPersona(persona), descripcion: descripcion.trim(), bien: bien.trim() || null, servicioId: servicioId || null });
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setListo(r);
    rastrear('cotizacion', { codigo: r.codigo });
  }

  if (listo) {
    return (
      <div className="tarjeta max-w-[560px] shadow-suave">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-exito-tenue text-exito">
          <Icono nombre="check" size={26} />
        </span>
        <h2 className="!mb-2">Solicitud {listo.codigo} recibida</h2>
        <p className="text-tinta-2">{n.nombre} la revisa y te escribe por WhatsApp con la cotización o la fecha de la visita. Cuando la cotización esté lista, la puedes ver y aprobar en este enlace:</p>
        <div className="flex flex-wrap gap-3">
          <Boton href={`/orden/${listo.token}`}>Ver mi solicitud</Boton>
          <Boton href="/" variante="secundario">
            Volver al inicio
          </Boton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[720px] flex-col gap-5">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Campo etiqueta="¿Qué necesitas?" htmlFor="o-descripcion">
        <textarea id="o-descripcion" className="entrada" rows={4} maxLength={2000} required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder={vehiculo ? 'Ejemplo: cambio de pastillas de freno y revisión de suspensión.' : 'Cuéntanos el problema o el trabajo que necesitas.'} />
      </Campo>
      {(vehiculo || equipo) && (
        <Campo etiqueta={vehiculo ? 'Placa y vehículo' : 'Equipo'} htmlFor="o-bien" className="max-w-md" ayuda={vehiculo ? 'Ejemplo: ABC123, Mazda 3 2019' : 'Marca y modelo'}>
          <input id="o-bien" className="entrada" maxLength={160} value={bien} onChange={(e) => setBien(e.target.value)} />
        </Campo>
      )}
      {servicios.length > 0 && (
        <Campo etiqueta={`${cap(v.servicio[0])} (opcional)`} htmlFor="o-servicio" className="max-w-md">
          <select id="o-servicio" className="entrada" value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
            <option value="">Elegir…</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </Campo>
      )}
      <DatosPersona persona={persona} cambiar={cambiar} negocio={n.nombre} politicaDatos={n.politicaDatos} conEmpresa={n.perfil.rasgos.includes('empresa')} conDireccion={domicilio} prefijo="o" />
      <Boton type="submit" disabled={enviando} className="self-start">
        {enviando ? 'Enviando…' : 'Pedir cotización'} <Icono nombre="flecha" size={18} />
      </Boton>
    </form>
  );
}

const ETAPA: Record<string, string> = {
  created: 'Recibida',
  quoted: 'Cotizada',
  approved: 'Aprobada',
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  en_route: 'En camino',
  in_progress: 'En trabajo',
  completed: 'Terminada',
  delivered: 'Entregada',
  paid: 'Pagada',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
};

/** La orden por su clave: estado, cotización y decisión (aprobar o rechazar). */
export function MiOrden({ token }: { token: string }) {
  const [orden, setOrden] = useState<Orden | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nota, setNota] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function cargar() {
    const r = await obtener<{ orden: Orden }>(`ordenes/${token}`);
    if (r.ok) setOrden(r.orden);
    else setError(r.error);
  }
  useEffect(() => {
    let activo = true;
    obtener<{ orden: Orden }>(`ordenes/${token}`).then((r) => {
      if (!activo) return;
      if (r.ok) setOrden(r.orden);
      else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [token]);

  async function decidir(decision: 'aprobar' | 'rechazar') {
    setOcupado(true);
    setError(null);
    const r = await enviar<{ id: string }>(`ordenes/${token}/decision`, { decision, nota: nota.trim() || null });
    setOcupado(false);
    if (!r.ok) return setError(r.error);
    setAviso(decision === 'aprobar' ? 'Cotización aprobada. El equipo programa el trabajo y te avisa.' : 'Listo, quedó registrado que no continúas con esta cotización.');
    if (decision === 'aprobar') rastrear('cotizacion_aprobada', { codigo: orden?.codigo });
    await cargar();
  }

  if (error && !orden) return <Aviso tipo="error">{error}</Aviso>;
  if (!orden) return <Cargando texto="Buscando tu solicitud…" />;
  const c = orden.cotizacion;
  return (
    <div className="flex max-w-[720px] flex-col gap-4">
      {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
      {error && <Aviso tipo="error">{error}</Aviso>}
      <article className="tarjeta">
        <p className="eyebrow !mb-1">
          {orden.codigo} · {ETAPA[orden.etapa] ?? orden.etapa}
        </p>
        <h2 className="!mb-1">{orden.servicio}</h2>
        {orden.descripcion && <p className="m-0 whitespace-pre-line text-tinta-2">{orden.descripcion}</p>}
        {orden.entregaPrometida && <p className="mb-0 mt-2 text-[15px]">Entrega prometida: {fechaLarga(orden.entregaPrometida)}</p>}
        {orden.garantiaHasta && <p className="mb-0 mt-1 text-[15px]">Garantía hasta: {fechaLarga(orden.garantiaHasta)}</p>}
      </article>
      {c ? (
        <article className="tarjeta">
          <h3>Cotización</h3>
          <table className="w-full border-collapse text-[15px]">
            <tbody>
              <tr className="border-b border-linea">
                <td className="py-1.5">Mano de obra</td>
                <td className="py-1.5 text-right">{cop(c.manoDeObra)}</td>
              </tr>
              {c.materiales.map((m, i) => (
                <tr key={i} className="border-b border-linea">
                  <td className="py-1.5">
                    {m.nombre} {m.cantidad > 1 ? `× ${m.cantidad}` : ''}
                  </td>
                  <td className="py-1.5 text-right">{cop(m.valor * m.cantidad)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-display font-semibold">Total</td>
                <td className="py-2 text-right font-display font-semibold">{cop(c.total)}</td>
              </tr>
            </tbody>
          </table>
          {c.nota && <p className="mb-0 mt-2 text-sm text-tinta-2">{c.nota}</p>}
          {c.abierta ? (
            <div className="mt-4 flex flex-col gap-3">
              <Campo etiqueta="Comentario (opcional)" htmlFor="o-nota">
                <input id="o-nota" className="entrada" maxLength={300} value={nota} onChange={(e) => setNota(e.target.value)} />
              </Campo>
              <div className="flex flex-wrap gap-3">
                <Boton onClick={() => decidir('aprobar')} disabled={ocupado}>
                  Aprobar cotización
                </Boton>
                <Boton variante="secundario" onClick={() => decidir('rechazar')} disabled={ocupado}>
                  No continuar
                </Boton>
              </div>
            </div>
          ) : (
            <p className="mb-0 mt-3 text-sm text-tinta-3">Estado de la cotización: {c.estado === 'approved' ? 'aprobada' : c.estado === 'rejected' ? 'rechazada' : c.estado}.</p>
          )}
        </article>
      ) : (
        <Aviso>Todavía no hay cotización. Cuando esté lista te avisamos por WhatsApp y la verás aquí.</Aviso>
      )}
    </div>
  );
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
