CREATE TABLE category_transfers (
    id SERIAL PRIMARY KEY,

    cycle_id INT NOT NULL REFERENCES salary_cycles(id) ON DELETE CASCADE,

    from_category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    to_category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    transfer_date DATE NOT NULL,

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);