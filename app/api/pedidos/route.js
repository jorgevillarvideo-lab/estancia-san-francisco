import { supabaseAdmin } from '../_lib/supabase.js';
import { generarToken, jsonResponse } from '../_lib/helpers.js';

export const runtime = 'nodejs';

const MAX_PEDIDOS_ACTIVOS = 2;

// ============================================================
// POST /api/pedidos — crear pedido
// ============================================================
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido' }, 400);
  }

  const { cliente_id, items, notas, hora_retiro_txt } = body || {};

  if (!cliente_id || !items || !hora_retiro_txt) {
    return jsonResponse({ ok: false, error: 'Faltan datos del pedido' }, 400);
  }

  // Verificar que el cliente exista
  const { data: cliente } = await supabaseAdmin
    .from('clientes')
    .select('id, nombre, telefono, total_pedidos')
    .eq('id', cliente_id)
    .maybeSingle();

  if (!cliente) {
    return jsonResponse(
      { ok: false, error: 'Cliente no encontrado. Volvé a registrarte.' },
      401
    );
  }

  // Validación mínima de items
  if (!items.pan || !Array.isArray(items.pan) || items.pan.length === 0) {
    return jsonResponse(
      { ok: false, error: 'Falta elegir el pan' },
      400
    );
  }
  if (!items.embutido || !Array.isArray(items.embutido) || items.embutido.length === 0) {
    return jsonResponse(
      { ok: false, error: 'Elegí al menos un fiambre' },
      400
    );
  }

  // Rate limit: máximo 2 pedidos activos por cliente
  const { data: activos } = await supabaseAdmin
    .from('pedidos')
    .select('id')
    .eq('cliente_id', cliente_id)
    .in('estado', ['pendiente', 'preparando']);

  if (activos && activos.length >= MAX_PEDIDOS_ACTIVOS) {
    return jsonResponse(
      {
        ok: false,
        error: `Ya tenés ${MAX_PEDIDOS_ACTIVOS} pedidos en preparación. Esperá a retirar alguno antes de hacer otro.`,
        codigo_error: 'limite_activos',
      },
      429
    );
  }

  // Número correlativo del día (simple: contar pedidos del día y sumar 1)
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);
  const { count: pedidosHoy } = await supabaseAdmin
    .from('pedidos')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', inicioDia.toISOString());

  const numero = (pedidosHoy || 0) + 1;
  const token = generarToken(8);

  const { data: pedido, error: insertErr } = await supabaseAdmin
    .from('pedidos')
    .insert({
      cliente_id,
      numero_pedido_dia: numero,
      token,
      items,
      notas: notas || null,
      hora_retiro_txt,
      estado: 'pendiente',
    })
    .select('*')
    .single();

  if (insertErr || !pedido) {
    console.error('[pedidos] Error insert:', insertErr);
    return jsonResponse({ ok: false, error: 'Error guardando pedido' }, 500);
  }

  // Sumar al total del cliente
  await supabaseAdmin
    .from('clientes')
    .update({ total_pedidos: (cliente.total_pedidos || 0) + 1 })
    .eq('id', cliente_id);

  return jsonResponse({
    ok: true,
    pedido: {
      id: pedido.id,
      numero: pedido.numero_pedido_dia,
      token: pedido.token,
      hora_retiro_txt: pedido.hora_retiro_txt,
      estado: pedido.estado,
      created_at: pedido.created_at,
    },
  });
}

// ============================================================
// GET /api/pedidos?cliente_id=xxx — listar pedidos del cliente
// ============================================================
export async function GET(request) {
  const url = new URL(request.url);
  const clienteId = url.searchParams.get('cliente_id');

  if (!clienteId) {
    return jsonResponse({ ok: false, error: 'Falta cliente_id' }, 400);
  }

  const { data: pedidos, error } = await supabaseAdmin
    .from('pedidos')
    .select('id, numero_pedido_dia, token, items, notas, hora_retiro_txt, estado, created_at, cancelado_en, retirado_en')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[pedidos] Error listar:', error);
    return jsonResponse({ ok: false, error: 'Error consultando pedidos' }, 500);
  }

  return jsonResponse({ ok: true, pedidos: pedidos || [] });
}
