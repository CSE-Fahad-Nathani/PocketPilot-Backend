export const CREATE_CYCLE = `
INSERT INTO salary_cycles (
    cycle_name,
    start_date,
    status
)
VALUES ($1, $2, 'ACTIVE')
RETURNING *;
`;

export const GET_ACTIVE_CYCLE = `
SELECT *
FROM salary_cycles
WHERE status = 'ACTIVE'
LIMIT 1;
`;


export const GET_CYCLE_HISTORY = `
SELECT
    id,
    cycle_name,
    start_date,
    end_date,
    planned_budget,
    total_income,
    total_expense,
    total_saved,
    created_at,
    updated_at
FROM salary_cycles
WHERE status = 'COMPLETED'
ORDER BY updated_at DESC, id DESC;
`;


export const GET_CYCLE_ANALYSIS = `
SELECT
    id,
    cycle_name,
    start_date,
    end_date,
    planned_budget,
    total_income,
    total_expense,
    total_saved
FROM salary_cycles
WHERE id = $1;
`;



export const VERIFY_END_CYCLE = `
SELECT
    id,
    cycle_name,
    total_income,
    total_expense,
    total_saved
FROM salary_cycles
WHERE id = $1
AND status = 'ACTIVE';
`;

export const END_CYCLE = `
UPDATE salary_cycles
SET
    end_date = $1,
    status = 'COMPLETED',
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;
`;