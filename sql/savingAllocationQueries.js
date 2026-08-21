export const CREATE_SAVING_ALLOCATION = `
INSERT INTO saving_allocations (
    saving_id,
    bucket_id,
    amount
)
VALUES ($1, $2, $3)
RETURNING *;
`;

export const GET_SAVING_BY_ID = `
SELECT *
FROM savings
WHERE id = $1;
`;

export const GET_TOTAL_ALLOCATED = `
SELECT
    COALESCE(SUM(amount), 0) AS total_allocated
FROM saving_allocations
WHERE saving_id = $1;
`;

export const UPDATE_BUCKET_BALANCE = `
UPDATE saving_buckets
SET
    balance = balance + $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
`;

export const GET_SAVING_BUCKET_BY_ID = `
SELECT *
FROM saving_buckets
WHERE id = $1
AND is_archived = FALSE;
`;

export const GET_PENDING_SAVINGS = `
SELECT
    s.id,
    s.title,
    s.amount,

    COALESCE(SUM(sa.amount), 0) AS allocated_amount,

    s.amount - COALESCE(SUM(sa.amount), 0) AS remaining_amount,

    s.transaction_date

FROM savings s

JOIN salary_cycles sc
ON s.cycle_id = sc.id

LEFT JOIN saving_allocations sa
ON s.id = sa.saving_id

WHERE s.type = 'DEPOSIT'
  AND sc.user_id = $1

GROUP BY
    s.id,
    s.title,
    s.amount,
    s.transaction_date

HAVING s.amount - COALESCE(SUM(sa.amount), 0) > 0

ORDER BY s.transaction_date DESC;
`;
