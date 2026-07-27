CREATE TABLE savings (
    id SERIAL PRIMARY KEY,

    cycle_id INT REFERENCES salary_cycles(id) ON DELETE SET NULL,

    bucket_id INT REFERENCES saving_buckets(id) ON DELETE SET NULL,

    type VARCHAR(20) NOT NULL,

    title VARCHAR(100) NOT NULL,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    transaction_date DATE NOT NULL,

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);