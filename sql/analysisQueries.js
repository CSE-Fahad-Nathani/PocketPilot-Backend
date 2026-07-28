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

export const GET_CYCLE_INCOMES = `
SELECT
    id,
    type,
    amount,
    income_date,
    note
FROM income
WHERE cycle_id = $1
ORDER BY income_date ASC, id ASC;
`;

export const GET_CYCLE_CATEGORIES = `
SELECT
    c.id,
    c.name,
    c.type,
    c.budget AS planned_budget,

    COALESCE(SUM(e.amount),0) AS spent_amount,

    c.budget - COALESCE(SUM(e.amount),0) AS remaining_amount

FROM categories c

LEFT JOIN expenses e
ON e.category_id = c.id

WHERE c.cycle_id = $1

GROUP BY
    c.id,
    c.name,
    c.type,
    c.budget

ORDER BY c.sort_order, c.id;
`;

export const GET_CYCLE_EXPENSES = `
SELECT
    e.id,
    e.category_id,
    c.name AS category_name,
    e.reason,
    e.amount,
    e.expense_date,
    e.note

FROM expenses e

JOIN categories c
ON c.id = e.category_id

WHERE e.cycle_id = $1

ORDER BY e.expense_date ASC, e.id ASC;
`;

export const GET_CYCLE_SAVINGS = `
SELECT
    s.id,
    s.bucket_id,
    sb.name AS bucket_name,
    s.type,
    s.title,
    s.amount,
    s.transaction_date,
    s.note

FROM savings s

LEFT JOIN saving_buckets sb
ON sb.id = s.bucket_id

WHERE s.cycle_id = $1

ORDER BY s.transaction_date ASC, s.id ASC;
`;

export const GET_CYCLE_FUEL_ANALYSIS = `
SELECT
    e.id AS expense_id,
    e.expense_date,

    e.amount::FLOAT8 AS amount,

    ((e.extra_data->>'liters')::NUMERIC)::FLOAT8 AS liters,
    ((e.extra_data->>'distance')::NUMERIC)::FLOAT8 AS distance,
    ((e.extra_data->>'mileage')::NUMERIC)::FLOAT8 AS mileage

FROM expenses e

JOIN categories c
ON c.id = e.category_id

WHERE
    e.cycle_id = $1
    AND c.type = 'fuel'

ORDER BY e.expense_date ASC, e.id ASC;
`;

export const GET_CURRENT_MONTH_FUEL_ANALYSIS = `
SELECT
    e.id AS expense_id,
    e.expense_date,

    e.amount::FLOAT8 AS amount,

    ((e.extra_data->>'liters')::NUMERIC)::FLOAT8 AS liters,
    ((e.extra_data->>'distance')::NUMERIC)::FLOAT8 AS distance,
    ((e.extra_data->>'mileage')::NUMERIC)::FLOAT8 AS mileage

FROM expenses e

WHERE
    e.reason = 'Access Fuel'
    AND e.cycle_id = (
        SELECT MAX(cycle_id)
        FROM expenses
        WHERE reason = 'Access Fuel'
    )

ORDER BY e.expense_date ASC, e.id ASC;
`;