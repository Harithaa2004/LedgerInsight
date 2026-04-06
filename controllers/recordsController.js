const db = require("../config/db");

// CREATE RECORD
const createRecord = async (req, res) => {
  try {
    let { amount, type, category, date, notes } = req.body;

    //Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be > 0" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Category required" });
    }

    if (!date) {
      return res.status(400).json({ error: "Date required" });
    }

    //Normalize category
    category = category.toLowerCase();

    //Backend-controlled fields
    const userId = req.user.id;
    const isDeleted = false;
    //Check balance only for expense
if (type === "expense") {
  const [balanceResult] = await db.query(`
    SELECT 
      IFNULL(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) -
      IFNULL(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0)
      AS balance
    FROM financial_records
    WHERE userId = ? AND isDeleted = false
  `, [userId]);

  const balance = balanceResult[0].balance;

  if (amount > balance) {
    return res.status(400).json({
      error: "Insufficient balance"
    });
  }
}
    const query = `
      INSERT INTO financial_records
      (userId, amount, type, category, date, notes, isDeleted)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      userId,
      amount,
      type,
      category,
      date,
      notes || null,
      isDeleted,
    ]);

    return res.status(201).json({
      message: "Record created successfully",
      recordId: result.insertId,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET RECORDS
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // user-specific data
    let query = "SELECT * FROM financial_records WHERE isDeleted = false AND userId = ?";
    let values = [req.user.id];

    if (type) {
      query += " AND type = ?";
      values.push(type);
    }

    if (category) {
      query += " AND category = ?";
      values.push(category);
    }

    if (startDate && endDate) {
      query += " AND date BETWEEN ? AND ?";
      values.push(startDate, endDate);
    }

    const [results] = await db.query(query, values);

    return res.json(results);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.query(
      "UPDATE financial_records SET isDeleted = true WHERE id = ? AND userId = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    return res.json({ message: "Record deleted successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    let { amount, type, category, date, notes } = req.body;
    const userId = req.user.id;

    // console.log(`Update Request: ID=${id}, UserId=${userId}, Body:`, req.body);

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be > 0" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Balance check if expense
    if (type === "expense") {
      const [balanceResult] = await db.query(`
        SELECT 
          IFNULL(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) -
          IFNULL(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0)
          AS balance
        FROM financial_records
        WHERE userId = ? AND isDeleted = false AND id != ?
      `, [userId, id]);

      const balance = balanceResult[0].balance;

      if (amount > balance) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
    }

    const [result] = await db.query(
      `UPDATE financial_records 
       SET amount=?, type=?, category=?, date=?, notes=? 
       WHERE id=? AND userId=?`,
      [amount, type, category, date, notes, id, userId]
    );

    // console.log(` Update Result: affectedRows=${result.affectedRows}, ID=${id}, UserId=${userId}`);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    return res.json({ message: "Record updated successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRecord,
  getRecords,
  deleteRecord,
    updateRecord,
};