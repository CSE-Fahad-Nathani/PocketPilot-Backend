export const GET_BUCKET_BY_ID = `
SELECT *
FROM saving_buckets
WHERE id = $1
AND is_archived = FALSE;
`;

export const DEBIT_BUCKET = `
UPDATE saving_buckets
SET
    balance = balance - $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const CREDIT_BUCKET = `
UPDATE saving_buckets
SET
    balance = balance + $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;