'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ESTADOS_LABELS = {
  pendiente: 'Pendiente',
  preparando: 'En cocina',
  listo: 'Listo',
  retirado: 'Retirado',
  cancelado: 'Cancelado',
};

const ESTADOS_COLORES = {
  pendiente: { bg: '#F2C53D', fg: '#0F0F0F' }, // amarillo
  preparando: { bg: '#3A7A33', fg: '#fff' }, // verde
  listo: { bg: '#C8202C', fg: '#fff' }, // rojo
  retirado: { bg: '#5c5c5c', fg: '#fff' }, // gris
  cancelado: { bg: '#d8d4c8', fg: '#0F0F0F' }, // crema
};

export default function Dashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [contadores, setContadores] = useState({});
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargarPedidos = useCallback(async () => {
    setActualizando(true);
    try {
      const params = new URLSearchParams();
      if (filtroEstado !== 'todos') params.set('estado', filtroEstado);
      if (busqueda.trim()) params.set('busqueda', busqueda.trim());

      const res = await fetch('/api/admin/pedidos?' + params.toString());
      if (res.status === 401) {
        router.push('/gestion-7k2m9p/login');
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Error');
        return;
      }
      setPedidos(data.pedidos || []);
      setContadores(data.contadores || {});
      setError(null);
      setUltimaActualizacion(new Date());
    } catch (err) {
      setError('Sin conexión');
    } finally {
      setActualizando(false);
      setCargandoInicial(false);
    }
  }, [filtroEstado, busqueda, router]);

  // Carga inicial + auto-refresh cada 15s
  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 15000);
    return () => clearInterval(interval);
  }, [cargarPedidos]);

  async function cambiarEstado(pedidoId, nuevoEstado) {
    if (!confirm(`¿Marcar como "${ESTADOS_LABELS[nuevoEstado]}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || 'Error');
        return;
      }
      cargarPedidos();
    } catch (err) {
      alert('Sin conexión');
    }
  }

  async function cerrarSesion() {
    if (!confirm('¿Cerrar sesión?')) return;
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/gestion-7k2m9p/login');
  }

  function siguienteEstado(estado) {
    if (estado === 'pendiente') return 'preparando';
    if (estado === 'preparando') return 'listo';
    if (estado === 'listo') return 'retirado';
    return null;
  }

  function siguienteEstadoLabel(estado) {
    if (estado === 'pendiente') return 'Tomar pedido';
    if (estado === 'preparando') return 'Marcar listo';
    if (estado === 'listo') return 'Marcar retirado';
    return null;
  }

  function resumenItems(items) {
    if (!items) return '—';
    const partes = [];
    const pan = items.pan?.[0]?.nombre;
    if (pan) partes.push(pan);
    const fiambres = (items.embutido || []).map((i) => i.nombre).join(', ');
    if (fiambres) partes.push(fiambres);
    const quesos = (items.queso || []).map((i) => i.nombre).join(', ');
    if (quesos) partes.push(`Quesos: ${quesos}`);
    return partes.join(' · ');
  }

  function totalItems(items) {
    if (!items) return 0;
    return (
      (items.pan?.length || 0) +
      (items.embutido?.length || 0) +
      (items.queso?.length || 0) +
      (items.encurtido?.length || 0) +
      (items.aderezo?.length || 0) +
      (items.acompanamiento?.length || 0) +
      (items.bebida?.length || 0)
    );
  }

  function formatHora(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <main style={styles.main}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerIzq}>
          <img src="/logo.png" alt="ESF" style={styles.logo} />
          <div>
            <div style={styles.tituloChico}>Gestión de pedidos</div>
            <div style={styles.subSucursal}>Sucursal El Cano · Av. El Cano 3202</div>
          </div>
        </div>
        <div style={styles.headerDer}>
          {ultimaActualizacion && (
            <span style={styles.actualizacion}>
              {actualizando ? '↻ Actualizando...' : `Última: ${formatHora(ultimaActualizacion.toISOString())}`}
            </span>
          )}
          <button onClick={cerrarSesion} style={styles.btnSalir}>
            Salir
          </button>
        </div>
      </header>

      {/* CONTADORES */}
      <section style={styles.contadores}>
        {['pendiente', 'preparando', 'listo', 'retirado'].map((e) => (
          <div
            key={e}
            style={{
              ...styles.contador,
              borderTopColor: ESTADOS_COLORES[e].bg,
              cursor: 'pointer',
              opacity: filtroEstado === 'todos' || filtroEstado === e ? 1 : 0.5,
            }}
            onClick={() => setFiltroEstado(filtroEstado === e ? 'todos' : e)}
          >
            <div style={styles.contadorLabel}>{ESTADOS_LABELS[e]}</div>
            <div style={styles.contadorVal}>{contadores[e] || 0}</div>
          </div>
        ))}
      </section>

      {/* FILTROS */}
      <section style={styles.filtros}>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={styles.select}
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="preparando">En cocina</option>
          <option value="listo">Listos</option>
          <option value="retirado">Retirados</option>
          <option value="cancelado">Cancelados</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre o teléfono"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.busqueda}
        />
      </section>

      {error && <div style={styles.errorBox}>{error}</div>}

      {/* TABLA / CARDS */}
      <section style={styles.tabla}>
        {cargandoInicial ? (
          <div style={styles.vacio}>Cargando...</div>
        ) : pedidos.length === 0 ? (
          <div style={styles.vacio}>No hay pedidos para mostrar</div>
        ) : (
          pedidos.map((p) => {
            const sig = siguienteEstado(p.estado);
            const sigLabel = siguienteEstadoLabel(p.estado);
            const cancelable =
              p.estado === 'pendiente' || p.estado === 'preparando';
            return (
              <article key={p.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.numero}>
                    #{String(p.numero_pedido_dia).padStart(3, '0')}
                  </div>
                  <div
                    style={{
                      ...styles.badgeEstado,
                      background: ESTADOS_COLORES[p.estado].bg,
                      color: ESTADOS_COLORES[p.estado].fg,
                    }}
                  >
                    {ESTADOS_LABELS[p.estado]}
                  </div>
                </div>

                <div style={styles.cardCuerpo}>
                  <div style={styles.cardFila}>
                    <span style={styles.cardEtq}>Cliente</span>
                    <span style={styles.cardVal}>
                      {p.cliente?.nombre || '—'}
                    </span>
                  </div>
                  <div style={styles.cardFila}>
                    <span style={styles.cardEtq}>Teléfono</span>
                    <a
                      href={`tel:+${p.cliente?.telefono}`}
                      style={{ ...styles.cardVal, color: '#C8202C', textDecoration: 'none' }}
                    >
                      +{p.cliente?.telefono || '—'}
                    </a>
                  </div>
                  <div style={styles.cardFila}>
                    <span style={styles.cardEtq}>Retira a las</span>
                    <span style={{ ...styles.cardVal, fontWeight: 700 }}>
                      {p.hora_retiro_txt}
                    </span>
                  </div>
                  <div style={styles.cardFila}>
                    <span style={styles.cardEtq}>Pedido</span>
                    <span style={styles.cardVal}>
                      {formatHora(p.created_at)}
                    </span>
                  </div>
                  <div style={styles.itemsResumen}>
                    <span style={styles.cardEtq}>
                      Items ({totalItems(p.items)})
                    </span>
                    <div style={styles.itemsTexto}>{resumenItems(p.items)}</div>
                    {p.notas && (
                      <div style={styles.notas}>
                        <strong>Nota:</strong> {p.notas}
                      </div>
                    )}
                  </div>
                </div>

                {(sig || cancelable) && (
                  <div style={styles.cardAcciones}>
                    {sig && (
                      <button
                        onClick={() => cambiarEstado(p.id, sig)}
                        style={styles.btnAccion}
                      >
                        {sigLabel} →
                      </button>
                    )}
                    {cancelable && (
                      <button
                        onClick={() => cambiarEstado(p.id, 'cancelado')}
                        style={styles.btnCancelar}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#F5F1E8',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#0F0F0F',
    paddingBottom: '3rem',
  },
  header: {
    background: '#0F0F0F',
    color: '#F5F1E8',
    padding: '1rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerIzq: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  headerDer: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo: { height: '36px', width: 'auto' },
  tituloChico: {
    fontSize: '1.1rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subSucursal: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#F2C53D',
    marginTop: '0.15rem',
  },
  actualizacion: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.7rem',
    color: 'rgba(245, 241, 232, 0.7)',
  },
  btnSalir: {
    background: 'transparent',
    color: '#F2C53D',
    border: '1px solid #F2C53D',
    padding: '0.4rem 0.85rem',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 600,
    cursor: 'pointer',
  },
  contadores: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '0.5rem',
    padding: '1.25rem',
  },
  contador: {
    background: '#fff',
    padding: '0.85rem 0.6rem',
    borderTop: '4px solid',
    transition: 'opacity 0.15s',
  },
  contadorLabel: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#5c5c5c',
    marginBottom: '0.3rem',
  },
  contadorVal: {
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  filtros: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1.25rem 1rem',
    flexWrap: 'wrap',
  },
  select: {
    padding: '0.6rem 0.75rem',
    border: '1px solid #d8d4c8',
    background: '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    flex: '0 0 auto',
  },
  busqueda: {
    padding: '0.6rem 0.75rem',
    border: '1px solid #d8d4c8',
    background: '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    flex: '1 1 200px',
  },
  errorBox: {
    margin: '0 1.25rem 1rem',
    padding: '0.75rem 1rem',
    background: 'rgba(200, 32, 44, 0.1)',
    borderLeft: '3px solid #C8202C',
    color: '#C8202C',
    fontSize: '0.85rem',
  },
  tabla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '0.75rem',
    padding: '0 1.25rem',
  },
  vacio: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#5c5c5c',
    fontStyle: 'italic',
  },
  card: {
    background: '#fff',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    paddingBottom: '0.6rem',
    borderBottom: '1px dashed #d8d4c8',
  },
  numero: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  badgeEstado: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 700,
    padding: '0.3rem 0.6rem',
  },
  cardCuerpo: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  cardFila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '0.5rem',
    padding: '0.2rem 0',
  },
  cardEtq: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#5c5c5c',
    fontWeight: 600,
    flexShrink: 0,
  },
  cardVal: {
    fontSize: '0.9rem',
    fontWeight: 500,
    textAlign: 'right',
  },
  itemsResumen: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px dashed #d8d4c8',
  },
  itemsTexto: {
    fontSize: '0.85rem',
    color: '#0F0F0F',
    marginTop: '0.25rem',
    lineHeight: 1.5,
  },
  notas: {
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: '#5c5c5c',
    background: '#F5F1E8',
    padding: '0.4rem 0.6rem',
    borderLeft: '2px solid #F2C53D',
  },
  cardAcciones: {
    marginTop: '0.85rem',
    paddingTop: '0.85rem',
    borderTop: '1px dashed #d8d4c8',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  btnAccion: {
    background: '#0F0F0F',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 0.9rem',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    flex: '1 1 auto',
  },
  btnCancelar: {
    background: 'transparent',
    color: '#C8202C',
    border: '1px solid #C8202C',
    padding: '0.65rem 0.9rem',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
  },
};
