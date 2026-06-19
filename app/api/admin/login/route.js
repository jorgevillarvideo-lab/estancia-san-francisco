import bcrypt from 'bcryptjs';
import {
  crearTokenAdmin,
  nombreCookie,
  maxAgeSegundos,
} from '../../_lib/admin-auth.js';
import { jsonResponse } from '../../_lib/helpers.js';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido' }, 400);
  }

  const { usuario, password } = body || {};
  if (!usuario || !password) {
    return jsonResponse({ ok: false, error: 'Faltan datos' }, 400);
  }

  // Comparar usuario
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_USER || !ADMIN_HASH) {
    return jsonResponse(
      { ok: false, error: 'Panel admin no configurado' },
      500
    );
  }

  if (usuario.trim().toLowerCase() !== ADMIN_USER.toLowerCase()) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  // Comparar password con bcrypt
  let passwordOk = false;
  try {
    passwordOk = await bcrypt.compare(password, ADMIN_HASH);
  } catch (err) {
    console.error('[admin/login] Error bcrypt:', err);
    return jsonResponse({ ok: false, error: 'Error de servidor' }, 500);
  }

  if (!passwordOk) {
    return jsonResponse(
      { ok: false, error: 'Usuario o contraseña incorrectos' },
      401
    );
  }

  // Crear token y devolver con cookie
  const token = crearTokenAdmin(ADMIN_USER);
  const maxAge = maxAgeSegundos();
  const cookieName = nombreCookie();

  const cookieValue = [
    `${cookieName}=${token}`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `HttpOnly`,
    `SameSite=Strict`,
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  return new Response(
    JSON.stringify({ ok: true, usuario: ADMIN_USER }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieValue,
      },
    }
  );
}
