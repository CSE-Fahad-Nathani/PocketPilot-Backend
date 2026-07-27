export const UPDATE_CYCLE_TOTALS = `
UPDATE salary_cycles
SET
    planned_budget = (
        SELECT COALESCE(SUM(budget), 0)
        FROM categories
        WHERE cycle_id = $1
        AND is_archived = FALSE
    ),
    total_income = (
        SELECT COALESCE(SUM(amount), 0)
        FROM income
        WHERE cycle_id = $1
    ),
    total_expense = (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE cycle_id = $1
    ),
    total_saved = (
        SELECT COALESCE(SUM(amount), 0)
        FROM income
        WHERE cycle_id = $1
    ) - (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE cycle_id = $1
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1;
`;