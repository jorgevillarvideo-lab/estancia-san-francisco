import { supabaseAdmin } from '../../_lib/supabase.js';
import { autenticarAdmin } from '../../_lib/admin-auth.js';
import { jsonResponse } from '../../_lib/helpers.js';

export const runtime = 'nodejs';

// GET /api/admin/pedidos?estado=...&desde=...&hasta=...&busqueda=...
export async function GET(request) {
  const auth = autenticarAdmin(request);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status);

  const url = new URL(request.url);
  const estado = url.searchParams.get('estado'); // todos / pendiente / preparando / listo / retirado / cancelado
  const desde = url.searchParams.get('desde'); // YYYY-MM-DD
  const hasta = url.searchParams.get('hasta'); // YYYY-MM-DD
  const busqueda = url.searchParams.get('busqueda')?.trim() || null;

  let query = supabaseAdmin
    .from('pedidos')
    .select(
      `id, numero_pedido_dia, token, items, notas, hora_retiro_txt,
       estado, cancelado_en, retirado_en, created_at,
       cliente:clientes ( id, nombre, telefono, total_pedidos )`
    )
    .order('created_at', { ascending: false })
    .limit(200);

  // Filtros
  if (estado && estado !== 'todos') {
    query = query.eq('estado', estado);
  }

  // Default: hoy si no se pasa rango
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const desdeISO = desde
    ? new Date(desde + 'T00:00:00').toISOString()
    : hoy.toISOString();

  let hastaISO;
  if (hasta) {
    const h = new Date(hasta + 'T23:59:59.999');
    hastaISO = h.toISOString();
  } else {
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);
    hastaISO = finHoy.toISOString();
  }

  query = query.gte('created_at', desdeISO).lte('created_at', hastaISO);

  const { data, error } = await query;
  if (error) {
    console.error('[admin/pedidos] Error:', error);
    return jsonResponse({ ok: false, error: 'Error consultando pedidos' }, 500);
  }

  let resultado = data || [];

  // Búsqueda por nombre o teléfono (filtro client-side post query)
  if (busqueda) {
    const term = busqueda.toLowerCase();
    resultado = resultado.filter((p) => {
      const nombre = (p.cliente?.nombre || '').toLowerCase();
      const tel = (p.cliente?.telefono || '').toLowerCase();
      return nombre.includes(term) || tel.includes(term);
    });
  }

  // Contadores para el header del dashboard (sobre TODOS los del día, no filtrados)
  const { data: todosHoy } = await supabaseAdmin
    .from('pedidos')
    .select('estado')
    .gte('created_at', desdeISO)
    .lte('created_at', hastaISO);

  const contadores = {
    pendiente: 0,
    preparando: 0,
    listo: 0,
    retirado: 0,
    cancelado: 0,
  };
  for (const p of todosHoy || []) {
    if (contadores[p.estado] !== undefined) contadores[p.estado] += 1;
  }

  return jsonResponse({ ok: true, pedidos: resultado, contadores });
}
