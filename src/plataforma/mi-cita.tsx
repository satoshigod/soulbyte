'use client';
import { useEffect, useState } from 'react';
import { enviar, obtener, type Cita, type Negocio } from './api';
import { cop, fechaLarga, hora } from './formato';
import { Aviso, Boton, Campo, Cargando, Icono } from './ui';

const ESTADO: Record<Cita['estado'], string> = {
  pending: 'Por confirmar',
  confirmed: 'Confirmada',
  arrived: 'En sede',
  in_progress: 'En atención',
  completed: 'Atendida',
  no_show: 'No asistió',
  cancelled: 'Cancelada',
};

/** La cita del cliente por su clave: ver, cancelar, responder el formulario previo y la encuesta. */
export function MiCita({ negocio: n, token }: { negocio: Negocio; token: string }) {
  const v = n.perfil.vocabulario;
  const [cita, setCita] = useState<Cita | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [vista, setVista] = useState<'ver' | 'cancelar' | 'formulario' | 'encuesta'>('ver');
  const [motivo, setMotivo] = useState('');
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [sensibles, setSensibles] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  async function cargar() {
    const r = await obtener<{ cita: Cita }>(`citas/${token}`);
    if (r.ok) setCita(r.cita);
    else setError(r.error);
  }
  useEffect(() => {
    let activo = true;
    obtener<{ cita: Cita }>(`citas/${token}`).then((r) => {
      if (!activo) return;
      if (r.ok) {
        setCita(r.cita);
        setRespuestas(r.cita.preguntas.map(() => ''));
      } else setError(r.error);
    });
    return () => {
      activo = false;
    };
  }, [token]);

  async function cancelar() {
    setOcupado(true);
    setError(null);
    const r = await enviar<{ id: string }>(`citas/${token}/cancelar`, { motivo: motivo.trim() || null });
    setOcupado(false);
    if (!r.ok) return setError(r.error);
    setAviso(`Tu ${v.cita[0]} quedó cancelada.`);
    setVista('ver');
    await cargar();
  }

  async function enviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    setOcupado(true);
    setError(null);
    const r = await enviar<{ id: string }>(`citas/${token}/formulario`, { respuestas, autorizaSensibles: sensibles });
    setOcupado(false);
    if (!r.ok) return setError(r.error);
    setAviso('Gracias, recibimos tus respuestas.');
    setVista('ver');
    await cargar();
  }

  async function enviarEncuesta(e: React.FormEvent) {
    e.preventDefault();
    if (!calificacion) return setError('Elige una calificación de 1 a 5.');
    setOcupado(true);
    setError(null);
    const r = await enviar<{ id: string }>(`citas/${token}/encuesta`, { calificacion, comentario: comentario.trim() || null });
    setOcupado(false);
    if (!r.ok) return setError(r.error);
    setAviso('Gracias por contarnos cómo te fue.');
    setVista('ver');
    await cargar();
  }

  if (error && !cita) return <Aviso tipo="error">{error}</Aviso>;
  if (!cita) return <Cargando texto={`Buscando tu ${v.cita[0]}…`} />;

  const salud = n.perfil.rasgos.includes('salud');

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4">
        {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
        {error && <Aviso tipo="error">{error}</Aviso>}

        <article className="tarjeta">
          <p className="eyebrow !mb-1">{ESTADO[cita.estado] ?? cita.estado}</p>
          <h2 className="!mb-1">{cita.servicio}</h2>
          <p className="m-0 text-tinta-2">
            {fechaLarga(cita.inicio, n.zonaHoraria)} · {hora(cita.inicio, n.zonaHoraria)} a {hora(cita.fin, n.zonaHoraria)}
            {cita.profesional ? ` · con ${cita.profesional}` : ''}
          </p>
          <p className="mb-0 mt-2 text-[15px]">
            Valor: <strong>{cop(cita.valor)}</strong>
            {cita.anticipo > 0 ? ` · anticipo ${cop(cita.anticipo)} (${cita.anticipoEstado === 'paid' ? 'pagado' : 'pendiente'})` : ''}
          </p>
          {cita.anticipo > 0 && cita.anticipoEstado !== 'paid' && cita.comoPagar && (
            <div className="mt-3">
              <Aviso>
                <span className="whitespace-pre-line">{cita.comoPagar}</span>
                {cita.anticipoVence && <span className="mt-1 block text-xs">Plazo: {hora(cita.anticipoVence, n.zonaHoraria)}</span>}
              </Aviso>
            </div>
          )}
        </article>

        {vista === 'ver' && (
          <div className="flex flex-wrap gap-3">
            {cita.formularioPendiente && cita.estado !== 'cancelled' && <Boton onClick={() => setVista('formulario')}>Responder el formulario previo</Boton>}
            {cita.encuestaDisponible && <Boton onClick={() => setVista('encuesta')}>Calificar la atención</Boton>}
            {cita.puedeCancelar && (
              <Boton variante="secundario" onClick={() => setVista('cancelar')}>
                Cancelar {v.cita[0]}
              </Boton>
            )}
            {['pending', 'confirmed'].includes(cita.estado) && !cita.puedeCancelar && <p className="m-0 text-sm text-tinta-3">Ya no se puede cancelar en línea; escríbenos y te ayudamos.</p>}
          </div>
        )}

        {vista === 'cancelar' && (
          <div className="tarjeta flex flex-col gap-4">
            <h3 className="!mb-0">¿Cancelar la {v.cita[0]}?</h3>
            {cita.politicaCancelacion && <p className="m-0 text-[15px] text-tinta-2">{cita.politicaCancelacion}</p>}
            <Campo etiqueta="Motivo (opcional)" htmlFor="motivo">
              <input id="motivo" className="entrada" maxLength={300} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            </Campo>
            <div className="flex flex-wrap gap-3">
              <Boton onClick={cancelar} disabled={ocupado}>
                Sí, cancelar
              </Boton>
              <Boton variante="secundario" onClick={() => setVista('ver')}>
                No, conservarla
              </Boton>
            </div>
          </div>
        )}

        {vista === 'formulario' && (
          <form onSubmit={enviarFormulario} className="tarjeta flex flex-col gap-4">
            <h3 className="!mb-0">Antes de tu {v.cita[0]}</h3>
            <p className="m-0 text-[15px] text-tinta-2">Con estas respuestas te atendemos mejor. Solo las ve el equipo que te atiende.</p>
            {cita.preguntas.map((q, i) => (
              <Campo key={q} etiqueta={q} htmlFor={`preg-${i}`}>
                <textarea id={`preg-${i}`} className="entrada" rows={2} maxLength={600} value={respuestas[i] ?? ''} onChange={(e) => setRespuestas((r) => r.map((x, j) => (j === i ? e.target.value : x)))} />
              </Campo>
            ))}
            {salud && (
              <label className="flex items-start gap-2 text-[15px] leading-snug">
                <input type="checkbox" className="mt-1" checked={sensibles} onChange={(e) => setSensibles(e.target.checked)} required />
                <span>Autorizo el tratamiento de mis datos sensibles (de salud) para esta atención, según la Ley 1581 de 2012. *</span>
              </label>
            )}
            <div className="flex flex-wrap gap-3">
              <Boton type="submit" disabled={ocupado}>
                Enviar respuestas
              </Boton>
              <Boton variante="secundario" onClick={() => setVista('ver')}>
                Después
              </Boton>
            </div>
          </form>
        )}

        {vista === 'encuesta' && (
          <form onSubmit={enviarEncuesta} className="tarjeta flex flex-col gap-4">
            <h3 className="!mb-0">¿Cómo te fue?</h3>
            <div className="flex gap-1" role="radiogroup" aria-label="Calificación de 1 a 5">
              {[1, 2, 3, 4, 5].map((x) => (
                <button key={x} type="button" role="radio" aria-checked={calificacion === x} aria-label={`${x} de 5`} onClick={() => setCalificacion(x)} className={x <= calificacion ? 'text-primario' : 'text-linea-fuerte'}>
                  <Icono nombre="estrella" size={32} className={x <= calificacion ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
            <Campo etiqueta="Cuéntanos más (opcional)" htmlFor="comentario">
              <textarea id="comentario" className="entrada" rows={3} maxLength={600} value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </Campo>
            <div className="flex flex-wrap gap-3">
              <Boton type="submit" disabled={ocupado}>
                Enviar
              </Boton>
              <Boton variante="secundario" onClick={() => setVista('ver')}>
                Después
              </Boton>
            </div>
          </form>
        )}
      </div>

      <aside className="tarjeta h-fit bg-fondo-suave text-[15px]">
        <h3>{n.nombre}</h3>
        {n.direccion && (
          <p className="m-0 flex items-start gap-2 text-tinta-2">
            <Icono nombre="pin" size={18} className="mt-0.5 flex-none text-primario" />
            <span>
              {n.direccion}
              {n.ciudad ? `, ${n.ciudad}` : ''}
            </span>
          </p>
        )}
        {n.whatsapp && <p className="mb-0 mt-3 text-tinta-2">WhatsApp: {n.whatsapp}</p>}
        {n.correo && <p className="mb-0 mt-1 text-tinta-2">{n.correo}</p>}
      </aside>
    </div>
  );
}
