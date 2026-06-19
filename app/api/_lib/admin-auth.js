// Helper de autenticación admin
// Usa cookie firmada simple (HMAC) — sin JWT para no agregar dependencias extra
import crypto from 'crypto';

const COOKIE_NAME = 'sf_admin';
const DURACION_HORAS = 8;

function getSecret() {
  const s = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
  if (!s) throw new Error('Falta JWT_SECRET o ADMIN_SECRET en .env');
  return s;
}

// Crea un token simple: payload.signature, donde payload es base64(JSON con exp)
export function crearTokenAdmin(usuario) {
  const payload = {
    usuario,
    exp: Date.now() + DURACION_HORAS * 60 * 60 * 1000,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${sig}`;
}

// Verifica un token: si es válido y no venció, devuelve el payload
export function verificarTokenAdmin(token) {
  if (!token || typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 2) return null;
  const [payloadStr, sig] = partes;

  // Verificar firma
  const sigEsperada = crypto
    .createHmac('sha256', getSecret())
    .update(payloadStr)
    .digest('base64url');

  if (sig !== sigEsperada) return null;

  // Parsear payload
  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  // Verificar expiración
  if (!payload.exp || Date.now() > payload.exp) return null;

  return payload;
}

// Lee la cookie sf_admin del request, verifica y devuelve { ok, usuario }
export function autenticarAdmin(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return { ok: false, status: 401, error: 'No autenticado' };

  const payload = verificarTokenAdmin(token);
  if (!payload) return { ok: false, status: 401, error: 'Sesión expirada' };

  return { ok: true, usuario: payload.usuario };
}

export function nombreCookie() {
  return COOKIE_NAME;
}

export function maxAgeSegundos() {
  return DURACION_HORAS * 60 * 60;
}
