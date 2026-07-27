CREATE TABLE bucket_transactions (
    id SERIAL PRIMARY KEY,

    bucket_id INT NOT NULL REFERENCES saving_buckets(id) ON DELETE CASCADE,

    type VARCHAR(30) NOT NULL CHECK (
        type IN (
            'ALLOCATION',
            'WITHDRAWAL',
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'ARCHIVE'
        )
    ),

    reference_id INT,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    title VARCHAR(100),

    note TEXT,

    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);