export const GET_USER_BY_EMAIL = `
SELECT id, name, email, password_hash
FROM users
WHERE LOWER(email) = LOWER($1)
LIMIT 1;
`;

export const GET_USER_BY_ID = `
SELECT id, name, email
FROM users
WHERE id = $1
LIMIT 1;
`;

export const CREATE_USER = `
INSERT INTO users (name, email, password_hash)
VALUES ($1, $2, $3)
RETURNING id, name, email;
`;

export const GET_ACTIVE_CYCLE_ID_FOR_USER = `
SELECT id
FROM salary_cycles
WHERE user_id = $1
AND status = 'ACTIVE'
LIMIT 1;
`;
