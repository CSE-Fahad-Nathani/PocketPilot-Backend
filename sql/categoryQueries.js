export const CREATE_CATEGORY = `
INSERT INTO categories (
    cycle_id,
    name,
    type,
    budget,
    icon,
    color
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

export const GET_CATEGORIES = `
SELECT *
FROM categories
WHERE cycle_id = $1
AND is_archived = FALSE
ORDER BY sort_order ASC, id ASC;
`;

export const UPDATE_CATEGORY = `
UPDATE categories
SET
    name = $2,
    type = $3,
    budget = $4,
    icon = $5,
    color = $6,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const ARCHIVE_CATEGORY = `
UPDATE categories
SET
    is_archived = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const GET_CATEGORY_BY_ID = `
SELECT *
FROM categories
WHERE id = $1;
`;

export const CHECK_CATEGORY_EXISTS = `
SELECT id
FROM categories
WHERE cycle_id = $1
AND LOWER(name) = LOWER($2)
AND is_archived = FALSE;
`;

export const CHECK_CATEGORY_EXISTS_FOR_UPDATE = `
SELECT id
FROM categories
WHERE cycle_id = $1
AND LOWER(name) = LOWER($2)
AND id <> $3
AND is_archived = FALSE;
`;