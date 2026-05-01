const express = require("express");
const { auth } = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const query = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(query);
  const now = new Date();

  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "Todo").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
    overdue: tasks.filter((task) => task.status !== "Done" && new Date(task.dueDate) < now).length,
  };

  res.json(stats);
});

module.exports = router;