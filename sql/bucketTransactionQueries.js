export const CREATE_BUCKET_TRANSACTION = `
INSERT INTO bucket_transactions (
    bucket_id,
    type,
    reference_id,
    amount,
    title,
    note,
    transaction_date
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    CURRENT_DATE
)
RETURNING *;
`;

export const GET_BUCKET_TRANSACTIONS = `
SELECT *
FROM bucket_transactions
WHERE bucket_id = $1
ORDER BY created_at DESC;
`;

export const GET_BUCKET_SUMMARY = `
SELECT
    COALESCE(
        SUM(
            CASE
                WHEN type IN ('ALLOCATION','TRANSFER_IN')
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS total_credit,

    COALESCE(
        SUM(
            CASE
                WHEN type IN ('WITHDRAWAL','TRANSFER_OUT')
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS total_debit

FROM bucket_transactions

WHERE bucket_id = $1;
`;


export const GET_BUCKET_HISTORY = `
SELECT
    bt.id,
    bt.type,
    bt.amount,
    bt.title,
    bt.note,
    bt.transaction_date AS "transactionDate",
    bt.created_at AS "createdAt",
    sb.name AS "bucketName"
FROM bucket_transactions bt
JOIN saving_buckets sb
ON bt.bucket_id = sb.id
WHERE bt.bucket_id = $1
ORDER BY bt.created_at DESC;
`;