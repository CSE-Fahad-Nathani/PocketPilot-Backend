export const CREATE_TRANSFER = `
INSERT INTO category_transfers (
    cycle_id,
    from_category_id,
    to_category_id,
    amount,
    transfer_date,
    note
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

export const GET_TRANSFERS = `
SELECT
    ct.*,

    fc.name AS from_category_name,
    fc.icon AS from_category_icon,
    fc.color AS from_category_color,

    tc.name AS to_category_name,
    tc.icon AS to_category_icon,
    tc.color AS to_category_color

FROM category_transfers ct

JOIN categories fc
ON fc.id = ct.from_category_id

JOIN categories tc
ON tc.id = ct.to_category_id

WHERE ct.cycle_id = $1

ORDER BY ct.transfer_date DESC,
         ct.created_at DESC;
`;

export const GET_TRANSFER_BY_ID = `
SELECT *
FROM category_transfers
WHERE id = $1;
`;

export const UPDATE_TRANSFER = `
UPDATE category_transfers
SET
    from_category_id = $2,
    to_category_id = $3,
    amount = $4,
    transfer_date = $5,
    note = $6
WHERE id = $1
RETURNING *;
`;

export const DELETE_TRANSFER = `
DELETE FROM category_transfers
WHERE id = $1
RETURNING *;
`;

export const CHECK_CATEGORY_EXISTS = `
SELECT
    id,
    cycle_id,
    name,
    budget
FROM categories
WHERE id = $1;
`;

export const GET_CATEGORY_TRANSFER_SUMMARY = `
SELECT
    c.id,
    c.name,
    c.budget,

    COALESCE((
        SELECT SUM(amount)
        FROM category_transfers
        WHERE to_category_id = c.id
    ), 0) AS incoming_transfer,

    COALESCE((
        SELECT SUM(amount)
        FROM category_transfers
        WHERE from_category_id = c.id
    ), 0) AS outgoing_transfer

FROM categories c
WHERE c.cycle_id = $1;
`;

export const UPDATE_CATEGORY_BUDGET = `
UPDATE categories
SET budget = budget + $2
WHERE id = $1
RETURNING id, budget;
`;