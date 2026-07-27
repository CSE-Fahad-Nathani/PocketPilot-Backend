export const CREATE_SAVING = `
INSERT INTO savings (
    cycle_id,
    bucket_id,
    type,
    title,
    amount,
    transaction_date,
    note
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
`;

export const GET_ALL_SAVINGS = `
SELECT
    s.*,
    sb.name AS bucket_name
FROM savings s
LEFT JOIN saving_buckets sb
ON s.bucket_id = sb.id
ORDER BY transaction_date DESC, id DESC;
`;

export const GET_SAVING_BY_ID = `
SELECT
    s.*,
    sb.name AS bucket_name
FROM savings s
LEFT JOIN saving_buckets sb
ON s.bucket_id = sb.id
WHERE s.id = $1;
`;

export const UPDATE_SAVING = `
UPDATE savings
SET
    bucket_id = $1,
    type = $2,
    title = $3,
    amount = $4,
    transaction_date = $5,
    note = $6,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING *;
`;

export const DELETE_SAVING = `
DELETE FROM savings
WHERE id = $1
RETURNING *;
`;