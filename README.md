# Estancia San Francisco — Etapa 2

Aplicación de pedidos QR para Estancia San Francisco. Frontend en Next.js + base de datos en Supabase.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres + API REST)
- **Frontend**: vanilla JS sobre HTML estructural servido por Next.js

## Estructura

```
estancia-san-francisco/
├── app/                      # Next.js App Router
│   ├── layout.js             # Layout raíz (carga fonts, CSS, app.js)
│   ├── page.js               # Página principal (HTML estructural)
│   └── api/                  # API routes (backend)
│       ├── auth/
│       │   ├── solicitar-otp/route.js
│       │   └── verificar-otp/route.js
│       ├── pedidos/route.js  # POST crear, GET listar
│       └── _lib/             # Helpers compartidos
├── public/                   # Estáticos servidos en /
│   ├── app.js                # Toda la lógica del cliente
│   ├── styles.css
│   └── logo.png
├── supabase/migrations/
│   └── 001_schema.sql        # Schema de la base
├── .env.local.example        # Plantilla de variables
└── package.json
```

## Deploy paso a paso

### 1. Configurar la base de datos en Supabase

1. Entrá a tu proyecto Supabase: https://supabase.com/dashboard/project/kchppthtndzffshsgsyl
2. En el menú izquierdo: **SQL Editor**
3. Botón **"New query"**
4. Copiá y pegá el contenido de `supabase/migrations/001_schema.sql`
5. Botón **"Run"** (o `Ctrl+Enter`)
6. Si todo sale bien, vas a ver "Success. No rows returned."

### 2. Subir el código a GitHub

Desde tu compu, abrí una terminal en la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Etapa 2: backend + Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/estancia-san-francisco.git
git push -u origin main
```

(Reemplazá `TU_USUARIO` por tu usuario de GitHub.)

### 3. Conectar Vercel al repo

1. Entrá a https://vercel.com/new
2. Vas a ver tu repo `estancia-san-francisco` → botón **"Import"**
3. Vercel detecta que es Next.js automáticamente, no hay que configurar nada
4. En la sección **"Environment Variables"**, agregá:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (tu URL de Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (tu publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (tu secret key) |
| `MODO_DEMO` | `true` |

> Estas 3 keys se obtienen del dashboard de Supabase en Settings → API Keys.
> NUNCA las pongas en el código, solo en el panel de Vercel.

5. Botón **"Deploy"**
6. Tarda 2-3 minutos. Cuando termine, te da una URL tipo `https://estancia-san-francisco-xxxxx.vercel.app`

### 4. Probar

Abrí la URL de Vercel en el celular. Deberías ver:

- Pantalla de bienvenida la primera vez
- Registro con nombre + teléfono
- Código `123456` (modo demo, fijo)
- Verificación → entrás a la app
- Pedido se guarda en Supabase

## Verificar que el backend funciona

En Supabase → **Table Editor** → tabla `clientes` → debería aparecer el cliente que se registró.
En la tabla `pedidos` → debería aparecer el pedido que confirmó.

## Desarrollo local (opcional)

```bash
npm install
cp .env.local.example .env.local   # editar con tus keys
npm run dev
# abrir http://localhost:3000
```

## Cambiar de modo demo a producción real

Cuando esté listo el template de WhatsApp en Meta Business Manager:

1. En Vercel → Settings → Environment Variables:
   - `MODO_DEMO=false`
   - Agregar `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OTP_TEMPLATE_NAME`
2. Redeploy (clic en "Redeploy" en el dashboard)
3. El código OTP ahora será aleatorio y se enviará por WhatsApp real
