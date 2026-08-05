export const GET_TRACKED_BALANCE_SETTINGS = `
SELECT
    cycle_id AS "cycleId",
    include_left AS "includeLeft",
    category_ids AS "categoryIds",
    updated_at AS "updatedAt"
FROM cycle_tracked_balance_settings
WHERE cycle_id = $1;
`;

export const UPSERT_TRACKED_BALANCE_SETTINGS = `
INSERT INTO cycle_tracked_balance_settings (
    cycle_id,
    include_left,
    category_ids
)
VALUES ($1, $2, $3)
ON CONFLICT (cycle_id)
DO UPDATE SET
    include_left = EXCLUDED.include_left,
    category_ids = EXCLUDED.category_ids,
    updated_at = CURRENT_TIMESTAMP
RETURNING
    cycle_id AS "cycleId",
    include_left AS "includeLeft",
    category_ids AS "categoryIds",
    updated_at AS "updatedAt";
`;

export const GET_CYCLE_CATEGORY_IDS = `
SELECT id
FROM categories
WHERE cycle_id = $1
AND is_archived = FALSE
ORDER BY sort_order ASC, id ASC;
`;

export const GET_CYCLE_BY_ID = `
SELECT id
FROM salary_cycles
WHERE id = $1;
`;
