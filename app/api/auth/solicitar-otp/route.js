import { supabaseAdmin } from '../../_lib/supabase.js';
import { enviarOTP } from '../../_lib/whatsapp.js';
import {
  normalizarTelefono,
  telefonoValido,
  generarCodigoOTP,
  jsonResponse,
} from '../../_lib/helpers.js';

export const runtime = 'nodejs';

const COOLDOWN_SEG = 60;
const LIMITE_HORA = 3;
const TTL_MIN = 5;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido' }, 400);
  }

  const { telefono: telRaw, nombre } = body || {};
  if (!telRaw || !nombre) {
    return jsonResponse({ ok: false, error: 'Faltan datos' }, 400);
  }

  const telefono = normalizarTelefono(telRaw);
  if (!telefonoValido(telefono)) {
    return jsonResponse({ ok: false, error: 'Teléfono inválido' }, 400);
  }
  if (String(nombre).trim().length < 2) {
    return jsonResponse({ ok: false, error: 'Nombre inválido' }, 400);
  }

  // Rate limit 1: cooldown 60s
  const haceCooldown = new Date(Date.now() - COOLDOWN_SEG * 1000).toISOString();
  const { data: recientes } = await supabaseAdmin
    .from('otp_codigos')
    .select('id')
    .eq('telefono', telefono)
    .gte('created_at', haceCooldown)
    .limit(1);

  if (recientes && recientes.length > 0) {
    return jsonResponse(
      {
        ok: false,
        error: `Esperá ${COOLDOWN_SEG} segundos antes de pedir otro código`,
        codigo_error: 'cooldown',
      },
      429
    );
  }

  // Rate limit 2: máximo N por hora
  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: ultimaHora } = await supabaseAdmin
    .from('otp_codigos')
    .select('id')
    .eq('telefono', telefono)
    .gte('created_at', haceUnaHora);

  if (ultimaHora && ultimaHora.length >= LIMITE_HORA) {
    return jsonResponse(
      {
        ok: false,
        error: 'Pediste demasiados códigos. Esperá un rato.',
        codigo_error: 'limite_hora',
      },
      429
    );
  }

  // Generar e insertar OTP
  const codigo = generarCodigoOTP();
  const expiraEn = new Date(Date.now() + TTL_MIN * 60 * 1000).toISOString();

  const { error: insertErr } = await supabaseAdmin.from('otp_codigos').insert({
    telefono,
    codigo,
    expira_en: expiraEn,
  });

  if (insertErr) {
    console.error('[OTP] Error insert:', insertErr);
    return jsonResponse({ ok: false, error: 'Error guardando código' }, 500);
  }

  // Enviar
  const envio = await enviarOTP(telefono, codigo, nombre);
  if (!envio.ok) {
    return jsonResponse(
      { ok: false, error: envio.error || 'No se pudo enviar el código' },
      500
    );
  }

  return jsonResponse({
    ok: true,
    expira_en: expiraEn,
    modo: envio.modo,
  });
}
