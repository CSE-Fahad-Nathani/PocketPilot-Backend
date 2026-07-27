export const CREATE_INCOME = `
INSERT INTO income (
    cycle_id,
    type,
    amount,
    income_date,
    note
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const GET_INCOME = `
SELECT *
FROM income
WHERE cycle_id = $1
ORDER BY income_date DESC, id DESC;
`;

export const GET_INCOME_BY_ID = `
SELECT *
FROM income
WHERE id = $1;
`;

export const UPDATE_INCOME = `
UPDATE income
SET
    type = $2,
    amount = $3,
    income_date = $4,
    note = $5,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const DELETE_INCOME = `
DELETE FROM income
WHERE id = $1
RETURNING *;
`;

