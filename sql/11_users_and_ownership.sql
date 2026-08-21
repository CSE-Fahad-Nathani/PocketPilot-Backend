-- Multi-user foundation
-- 1) users table
-- 2) user_id on salary_cycles + saving_buckets
-- 3) one ACTIVE cycle per user

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE salary_cycles
    ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id);

ALTER TABLE saving_buckets
    ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_one_active_cycle_per_user
ON salary_cycles (user_id)
WHERE status = 'ACTIVE';
