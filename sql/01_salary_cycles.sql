CREATE TABLE salary_cycles (
    id SERIAL PRIMARY KEY,

    cycle_name VARCHAR(100),

    start_date DATE NOT NULL,
    end_date DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    planned_budget NUMERIC(12,2) DEFAULT 0,
    total_income NUMERIC(12,2) DEFAULT 0,
    total_expense NUMERIC(12,2) DEFAULT 0,
    total_saved NUMERIC(12,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);