CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,

    cycle_id INT NOT NULL REFERENCES salary_cycles(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

    expense_date DATE NOT NULL,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    reason VARCHAR(255) NOT NULL,
    note TEXT,

    extra_data JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);