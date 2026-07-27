export const GET_BUCKET_BY_ID = `
SELECT *
FROM saving_buckets
WHERE id = $1
AND is_archived = FALSE;
`;

export const UPDATE_BUCKET_BALANCE = `
UPDATE saving_buckets
SET
    balance = balance - $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;