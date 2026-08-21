export const CREATE_SAVING_BUCKET = `
INSERT INTO saving_buckets (
    user_id,
    name,
    icon,
    color
)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;

export const GET_SAVING_BUCKETS = `
SELECT *
FROM saving_buckets
WHERE user_id = $1
AND is_archived = FALSE
ORDER BY id ASC;
`;

export const CHECK_SAVING_BUCKET_EXISTS = `
SELECT id
FROM saving_buckets
WHERE user_id = $1
AND LOWER(name) = LOWER($2)
AND is_archived = FALSE;
`;
