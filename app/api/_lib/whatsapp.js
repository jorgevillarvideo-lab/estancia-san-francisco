// Envío de OTP por WhatsApp
// En MODO DEMO: solo loguea en server console (no envía nada)
// En producción real: usar Meta WhatsApp Cloud API
import { esModoDemo } from './helpers.js';

export async function enviarOTP(telefono, codigo, nombre) {
  if (esModoDemo()) {
    console.log('═══════════════════════════════════════════');
    console.log(`[DEMO-OTP] Estancia San Francisco`);
    console.log(`Para: ${nombre} (${telefono})`);
    console.log(`Código: ${codigo}`);
    console.log('═══════════════════════════════════════════');
    return { ok: true, modo: 'demo' };
  }

  // Producción real (configurar más adelante):
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const TEMPLATE = process.env.WHATSAPP_OTP_TEMPLATE_NAME;

  if (!TOKEN || !PHONE_ID || !TEMPLATE) {
    return { ok: false, error: 'WhatsApp no configurado en variables de entorno' };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefono,
          type: 'template',
          template: {
            name: TEMPLATE,
            language: { code: 'es' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: codigo }],
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[WA] Error envío OTP:', err);
      return { ok: false, error: 'No se pudo enviar el código' };
    }
    return { ok: true, modo: 'produccion' };
  } catch (err) {
    console.error('[WA] Excepción:', err);
    return { ok: false, error: 'Error de conexión' };
  }
}
