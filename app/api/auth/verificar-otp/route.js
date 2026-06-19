import { supabaseAdmin } from '../../_lib/supabase.js';
import {
  normalizarTelefono,
  generarToken,
  jsonResponse,
} from '../../_lib/helpers.js';

export const runtime = 'nodejs';

const MAX_INTENTOS = 3;
const SESION_DIAS = 90;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido' }, 400);
  }

  const { telefono: telRaw, codigo, nombre } = body || {};
  if (!telRaw || !codigo || !nombre) {
    return jsonResponse({ ok: false, error: 'Faltan datos' }, 400);
  }

  const telefono = normalizarTelefono(telRaw);
  const codigoLimpio = String(codigo).trim();
  const nombreLimpio = String(nombre).trim();

  if (codigoLimpio.length !== 6) {
    return jsonResponse({ ok: false, error: 'Código debe tener 6 dígitos' }, 400);
  }

  // Buscar OTP más reciente no usado
  const { data: otps } = await supabaseAdmin
    .from('otp_codigos')
    .select('*')
    .eq('telefono', telefono)
    .eq('usado', false)
    .order('created_at', { ascending: false })
    .limit(1);

  const otp = otps && otps[0];
  if (!otp) {
    return jsonResponse(
      { ok: false, error: 'No hay ningún código pendiente. Pedí uno nuevo.' },
      400
    );
  }

  // Expirado
  if (new Date(otp.expira_en) < new Date()) {
    return jsonResponse(
      { ok: false, error: 'El código venció. Pedí uno nuevo.' },
      400
    );
  }

  // Demasiados intentos
  if (otp.intentos >= MAX_INTENTOS) {
    return jsonResponse(
      { ok: false, error: 'Demasiados intentos. Pedí un código nuevo.' },
      400
    );
  }

  // Incrementar intentos antes de validar
  await supabaseAdmin
    .from('otp_codigos')
    .update({ intentos: otp.intentos + 1 })
    .eq('id', otp.id);

  // Comparar (timing-safe simple para strings cortas)
  if (codigoLimpio !== otp.codigo) {
    const restantes = MAX_INTENTOS - otp.intentos - 1;
    return jsonResponse(
      {
        ok: false,
        error: `Código incorrecto. Te quedan ${restantes} intento${restantes === 1 ? '' : 's'}.`,
        intentos_restantes: restantes,
      },
      400
    );
  }

  // Marcar OTP como usado
  await supabaseAdmin
    .from('otp_codigos')
    .update({ usado: true })
    .eq('id', otp.id);

  // Upsert cliente
  const { data: existente } = await supabaseAdmin
    .from('clientes')
    .select('id, total_pedidos')
    .eq('telefono', telefono)
    .maybeSingle();

  let clienteId;
  if (existente) {
    clienteId = existente.id;
    await supabaseAdmin
      .from('clientes')
      .update({ nombre: nombreLimpio, verificado_en: new Date().toISOString() })
      .eq('id', clienteId);
  } else {
    const { data: nuevo, error: clienteErr } = await supabaseAdmin
      .from('clientes')
      .insert({
        telefono,
        nombre: nombreLimpio,
        verificado_en: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (clienteErr || !nuevo) {
      console.error('[verificar-otp] Error creando cliente:', clienteErr);
      return jsonResponse({ ok: false, error: 'Error creando cuenta' }, 500);
    }
    clienteId = nuevo.id;
  }

  // Token de sesión (UUID simple, sin JWT por ahora — etapa 3)
  const token = generarToken(24);
  const expiraSesion = new Date(
    Date.now() + SESION_DIAS * 24 * 60 * 60 * 1000
  ).toISOString();

  return jsonResponse({
    ok: true,
    cliente: {
      id: clienteId,
      telefono,
      nombre: nombreLimpio,
      token,
      expira_en: expiraSesion,
    },
  });
}
