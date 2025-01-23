const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createTask, getTasks, getTaskStatistics, deleteTask, updateTask } = require("../controllers/taskController");
const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);
router.get("/statistics", protect, getTaskStatistics);

module.exports = router;
