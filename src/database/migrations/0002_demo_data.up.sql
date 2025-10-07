-- Requisitos (si no los tienes ya)
CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- gen_random_uuid(), crypt()

-- =========================
-- SEEDS: STATUS
-- =========================
INSERT INTO status (name) VALUES
                              ('ACTIVE'),
                              ('INACTIVE'),
                              ('DELETED'),
                              ('PENDING'),
                              ('PARTIALLY_PAID'),
                              ('PAID'),
                              ('CANCELLED'),
                              ('DISPUTED')
    ON CONFLICT (name) DO NOTHING;

-- =========================
-- SEEDS: USERS
-- (usa pgcrypto para generar hashes bcrypt de ejemplo;
--  en prod, genera el hash en tu backend)
-- =========================
INSERT INTO users (name, email, password_hash, status_id)
SELECT 'Ana Pérez', 'ana@example.com', crypt('secret123', gen_salt('bf')), s.id
FROM status s WHERE s.name = 'PENDING'
    ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, status_id)
SELECT 'Bruno Díaz', 'bruno@example.com', crypt('secret123', gen_salt('bf')), s.id
FROM status s WHERE s.name = 'PENDING'
    ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, status_id)
SELECT 'Carla Gómez', 'carla@example.com', crypt('secret123', gen_salt('bf')), s.id
FROM status s WHERE s.name = 'PENDING'
    ON CONFLICT (email) DO NOTHING;

-- =========================
-- SEEDS: DEBTS + PAYMENTS
-- Crea 3 deudas: pendiente, parcialmente pagada, y pagada
-- =========================

-- 1) Deuda PENDIENTE: Ana (acreedora) -> Bruno (deudor) COP 150,000
WITH u AS (
    SELECT
        (SELECT id FROM users WHERE email = 'ana@example.com')   AS ana_id,
        (SELECT id FROM users WHERE email = 'bruno@example.com') AS bruno_id
),
     st AS (
         SELECT
             (SELECT id FROM status WHERE name = 'PENDING') AS pending_id
     )
INSERT INTO debts (creditor_id, debtor_id, amount, currency, description, due_date, status_id)
SELECT u.ana_id, u.bruno_id, 150000.00, 'COP', 'Almuerzo equipo', CURRENT_DATE + INTERVAL '10 days', st.pending_id
FROM u, st;

-- 2) Deuda PARCIALMENTE PAGADA: Bruno (acreedor) -> Carla (deudora) COP 300,000
--    con un abono de 120,000
WITH u AS (
    SELECT
        (SELECT id FROM users WHERE email = 'bruno@example.com') AS bruno_id,
        (SELECT id FROM users WHERE email = 'carla@example.com') AS carla_id
),
     st AS (
         SELECT
             (SELECT id FROM status WHERE name = 'PARTIALLY_PAID') AS partial_id
     ),
     d AS (
INSERT INTO debts (creditor_id, debtor_id, amount, currency, description, due_date, status_id)
SELECT u.bruno_id, u.carla_id, 300000.00, 'COP', 'Compra mercado', CURRENT_DATE + INTERVAL '5 days', st.partial_id
FROM u, st
    RETURNING id
    )
INSERT INTO payments (debt_id, payer_id, amount, note)
SELECT d.id, u.carla_id, 120000.00, 'Abono inicial'
FROM d, u;

-- 3) Deuda PAGADA: Carla (acreedora) -> Ana (deudora) COP 80,000
--    totalmente pagada (paid_at set) y con un pago total
WITH u AS (
    SELECT
        (SELECT id FROM users WHERE email = 'carla@example.com') AS carla_id,
        (SELECT id FROM users WHERE email = 'ana@example.com')   AS ana_id
),
     st AS (
         SELECT
             (SELECT id FROM status WHERE name = 'PAID') AS paid_id
     ),
     d AS (
INSERT INTO debts (creditor_id, debtor_id, amount, currency, description, due_date, status_id, paid_at)
SELECT u.carla_id, u.ana_id, 80000.00, 'COP', 'Entradas cine', CURRENT_DATE - INTERVAL '2 days', st.paid_id, now()
FROM u, st
    RETURNING id
    )
INSERT INTO payments (debt_id, payer_id, amount, note)
SELECT d.id, u.ana_id, 80000.00, 'Pago total'
FROM d, u;
