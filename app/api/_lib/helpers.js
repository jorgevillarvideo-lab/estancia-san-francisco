// Helpers compartidos del backend

export function normalizarTelefono(tel) {
  if (!tel) return '';
  return String(tel).replace(/\D/g, '');
}

export function telefonoValido(tel) {
  const limpio = normalizarTelefono(tel);
  return limpio.length >= 10 && limpio.length <= 15;
}

// Token alfanumérico legible (sin chars confusos)
export function generarToken(largo = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let t = '';
  const buf = new Uint8Array(largo);
  crypto.getRandomValues(buf);
  for (let i = 0; i < largo; i++) t += chars[buf[i] % chars.length];
  return t;
}

// MODO DEMO: código fijo 123456 para presentaciones
// En producción real, esto se reemplaza por:
//   const buf = new Uint32Array(1);
//   crypto.getRandomValues(buf);
//   return String(buf[0] % 1000000).padStart(6, '0');
const MODO_DEMO = process.env.MODO_DEMO !== 'false'; // por default true

export function generarCodigoOTP() {
  if (MODO_DEMO) return '123456';
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1000000).padStart(6, '0');
}

export function esModoDemo() {
  return MODO_DEMO;
}

// Respuesta JSON helper
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
