export const GET_BUCKET_BY_ID = `
SELECT *
FROM saving_buckets
WHERE id = $1
AND is_archived = FALSE;
`;

export const ARCHIVE_BUCKET = `
UPDATE saving_buckets
SET
    is_archived = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;