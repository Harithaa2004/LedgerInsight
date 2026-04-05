const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");

const {
  createRecord,
  getRecords,
    deleteRecord,
    updateRecord,
} = require("../controllers/recordsController");

// Admin only
router.post("/", authorize("create_record"), createRecord);

// Admin + Analyst
router.get("/", authorize("view_record"), getRecords);
router.delete("/:id", authorize("delete_record"), deleteRecord);
router.put("/:id", authorize("update_record"), updateRecord);

module.exports = router;