-- =========================
-- Extensiones
-- =========================
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- emails case-insensitive


-- =========================
-- Estados
-- =========================
CREATE TABLE IF NOT EXISTS status (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT uq_status_name UNIQUE (name),
    CONSTRAINT status_name_not_blank CHECK (btrim(name) <> '')
    );

-- =========================
-- Usuarios
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status_id     UUID REFERENCES status(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMPTZ NULL,
    CONSTRAINT users_name_not_blank CHECK (btrim(name) <> ''),
    CONSTRAINT users_email_not_blank CHECK (btrim(email) <> '')
    );

-- =========================
-- Deudas
-- =========================
CREATE TABLE IF NOT EXISTS debts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creditor_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- quien presta
    debtor_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- quien debe
    amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    currency     CHAR(3) NOT NULL DEFAULT 'COP',
    description  TEXT,
    due_date     DATE,              -- fecha límite de pago
    paid_at      TIMESTAMPTZ,       -- cuándo quedó completamente pagada
    status_id    UUID REFERENCES status(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at   TIMESTAMPTZ NULL,
    CONSTRAINT debts_party_diff CHECK (creditor_id <> debtor_id)
    );

-- =========================
-- Pagos (abonos parciales o total)
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id    UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    payer_id   UUID        REFERENCES users(id) ON DELETE SET NULL, -- quien hizo el abono
    amount     NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at   TIMESTAMPTZ NULL
    );


-- =========================
-- Función para updated_at
-- =========================
-- Función genérica para actualizar updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

   -- status
DROP TRIGGER IF EXISTS trg_status_updated_at ON status;
CREATE TRIGGER trg_status_updated_at
    BEFORE UPDATE ON status
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- users
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- debts
DROP TRIGGER IF EXISTS trg_debts_updated_at ON debts;
CREATE TRIGGER trg_debts_updated_at
    BEFORE UPDATE ON debts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- payments
DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
