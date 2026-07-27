export const GET_TRANSACTION_HISTORY = `
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
ORDER BY bt.created_at DESC, bt.id DESC;
`;