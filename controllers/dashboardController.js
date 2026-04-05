const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    // 1️⃣ Total Income
    const [incomeResult] = await db.query(
      `SELECT IFNULL(SUM(amount), 0) AS totalIncome 
       FROM financial_records 
       WHERE type = 'income' AND isDeleted = false`
    );

    // 2️⃣ Total Expense
    const [expenseResult] = await db.query(
      `SELECT IFNULL(SUM(amount), 0) AS totalExpense 
       FROM financial_records 
       WHERE type = 'expense' AND isDeleted = false`
    );

    // 3️⃣ Category-wise totals
    const [categoryTotals] = await db.query(
      `SELECT category, SUM(amount) AS total 
       FROM financial_records 
       WHERE isDeleted = false
       GROUP BY category`
    );

    // 4️⃣ Monthly trends
    const [monthlyTrends] = await db.query(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM financial_records
       WHERE isDeleted = false
       GROUP BY month
       ORDER BY month ASC`
    );

    return res.json({
      totalIncome: incomeResult[0].totalIncome,
      totalExpense: expenseResult[0].totalExpense,
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

module.exports = { getDashboard };