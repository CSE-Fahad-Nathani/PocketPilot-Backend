CREATE TABLE IF NOT EXISTS cycle_tracked_balance_settings (
    cycle_id INT PRIMARY KEY REFERENCES salary_cycles(id) ON DELETE CASCADE,
    include_left BOOLEAN NOT NULL DEFAULT TRUE,
    category_ids INT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
