export const CREATE_EXPENSE = `
INSERT INTO expenses (
    cycle_id,
    category_id,
    expense_date,
    amount,
    reason,
    note,
    extra_data
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;
`;

export const GET_EXPENSES = `
SELECT
    e.*,
    c.name AS category_name,
    c.icon,
    c.color
FROM expenses e
JOIN categories c
ON c.id = e.category_id
WHERE e.cycle_id = $1
ORDER BY e.expense_date DESC, e.created_at DESC;
`;

export const GET_EXPENSE_BY_ID = `
SELECT *
FROM expenses
WHERE id = $1;
`;

export const UPDATE_EXPENSE = `
UPDATE expenses
SET
    category_id = $2,
    expense_date = $3,
    amount = $4,
    reason = $5,
    note = $6,
    extra_data = $7,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const DELETE_EXPENSE = `
DELETE FROM expenses
WHERE id = $1
RETURNING *;
`;

export const CHECK_CATEGORY_EXISTS = `
SELECT id, cycle_id
FROM categories
WHERE id = $1
AND is_archived = FALSE;
`;

