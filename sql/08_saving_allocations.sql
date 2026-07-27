CREATE TABLE saving_allocations (
    id SERIAL PRIMARY KEY,

    saving_id INT NOT NULL REFERENCES savings(id) ON DELETE CASCADE,

    bucket_id INT NOT NULL REFERENCES saving_buckets(id) ON DELETE CASCADE,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);