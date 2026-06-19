import { nombreCookie } from '../../_lib/admin-auth.js';

export const runtime = 'nodejs';

export async function POST() {
  const cookieName = nombreCookie();
  const cookieValue = [
    `${cookieName}=`,
    `Path=/`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=Strict`,
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieValue,
    },
  });
}
