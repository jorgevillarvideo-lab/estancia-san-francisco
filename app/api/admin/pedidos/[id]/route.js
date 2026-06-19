import { supabaseAdmin } from '../../../_lib/supabase.js';
import { autenticarAdmin } from '../../../_lib/admin-auth.js';
import { jsonResponse } from '../../../_lib/helpers.js';

export const runtime = 'nodejs';

const TRANSICIONES_VALIDAS = {
  pendiente: ['preparando', 'cancelado'],
  preparando: ['listo', 'cancelado'],
  listo: ['retirado', 'cancelado'],
  retirado: [], // estado final
  cancelado: [], // estado final
};

export async function PATCH(request, { params }) {
  const auth = autenticarAdmin(request);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status);

  const { id } = params;
  if (!id) return jsonResponse({ ok: false, error: 'Falta ID' }, 400);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido' }, 400);
  }

  const { estado: nuevoEstado } = body || {};
  if (!nuevoEstado) {
    return jsonResponse({ ok: false, error: 'Falta nuevo estado' }, 400);
  }

  // Leer pedido actual
  const { data: actual, error: errLeer } = await supabaseAdmin
    .from('pedidos')
    .select('id, estado')
    .eq('id', id)
    .maybeSingle();

  if (errLeer || !actual) {
    return jsonResponse({ ok: false, error: 'Pedido no encontrado' }, 404);
  }

  // Validar transición
  const validas = TRANSICIONES_VALIDAS[actual.estado] || [];
  if (!validas.includes(nuevoEstado)) {
    return jsonResponse(
      {
        ok: false,
        error: `No se puede pasar de "${actual.estado}" a "${nuevoEstado}"`,
      },
      400
    );
  }

  // Armar update con timestamps según el estado
  const update = { estado: nuevoEstado };
  const ahora = new Date().toISOString();

  if (nuevoEstado === 'cancelado') update.cancelado_en = ahora;
  if (nuevoEstado === 'retirado') update.retirado_en = ahora;

  const { data: actualizado, error: errUpd } = await supabaseAdmin
    .from('pedidos')
    .update(update)
    .eq('id', id)
    .select('id, estado, retirado_en, cancelado_en')
    .single();

  if (errUpd) {
    console.error('[admin/pedidos/PATCH] Error:', errUpd);
    return jsonResponse({ ok: false, error: 'Error actualizando' }, 500);
  }

  return jsonResponse({ ok: true, pedido: actualizado });
}
