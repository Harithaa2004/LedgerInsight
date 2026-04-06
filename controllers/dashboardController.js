const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Income (user-specific)
    const [incomeResult] = await db.query(
      `SELECT IFNULL(SUM(amount), 0) AS totalIncome 
       FROM financial_records 
       WHERE type = 'income' AND isDeleted = false AND userId = ?`,
      [userId]
    );

    const [expenseResult] = await db.query(
      `SELECT IFNULL(SUM(amount), 0) AS totalExpense 
       FROM financial_records 
       WHERE type = 'expense' AND isDeleted = false AND userId = ?`,
      [userId]
    );

    const totalIncome = incomeResult[0].totalIncome;
    const totalExpense = expenseResult[0].totalExpense;
    const netBalance = totalIncome - totalExpense;

    // Viewer: only summary
    if (req.user.role === 2) {
      return res.json({
        totalIncome,
        totalExpense,
        netBalance
      });
    }

    // Category-wise totals (Analyst/Admin)
    const [categoryTotals] = await db.query(
      `SELECT category, SUM(amount) AS total 
       FROM financial_records 
       WHERE isDeleted = false AND userId = ?
       GROUP BY category`,
      [userId]
    );

    // Monthly trends (Analyst/Admin)
    const [monthlyTrends] = await db.query(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM financial_records
       WHERE isDeleted = false AND userId = ?
       GROUP BY month
       ORDER BY month ASC`,
      [userId]
    );

    return res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryTotals,
      monthlyTrends
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboard,
};