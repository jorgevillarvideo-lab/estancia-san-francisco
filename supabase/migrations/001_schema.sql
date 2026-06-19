-- ============================================================
-- ESTANCIA SAN FRANCISCO — Schema Etapa 2
-- Tablas: clientes, otp_codigos, pedidos
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono text UNIQUE NOT NULL,
  nombre text NOT NULL,
  verificado_en timestamptz NOT NULL DEFAULT now(),
  total_pedidos int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS otp_codigos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono text NOT NULL,
  codigo text NOT NULL,
  expira_en timestamptz NOT NULL,
  usado boolean NOT NULL DEFAULT false,
  intentos int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_otp_telefono ON otp_codigos(telefono, created_at DESC);

CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id),
  numero_pedido_dia int NOT NULL,
  token text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  notas text,
  hora_retiro_txt text NOT NULL,
  estado text NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente','preparando','listo','retirado','cancelado')),
  cancelado_en timestamptz,
  retirado_en timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Habilitamos RLS pero las API routes usan service_role key
-- que bypasea las policies. El frontend nunca toca Supabase directo.
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Policy mínima: nada. Solo el service_role accede.
