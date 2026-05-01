const express = require("express");
const { z } = require("zod");
const { auth } = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string(),
  projectId: z.string(),
  assignedTo: z.string(),
});

const updateTaskSchema = z.object({
  status: z.enum(["Todo", "In Progress", "Done"]),
});

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .sort({ dueDate: 1 });
  res.json(tasks);
});

router.post("/", auth, async (req, res) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const project = await Project.findById(data.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isTeamMember = project.team.map(String).includes(String(req.user._id));
    if (!isTeamMember || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admin team members can create tasks" });
    }

    if (!project.team.map(String).includes(data.assignedTo)) {
      return res.status(400).json({ message: "Assignee must belong to this project team" });
    }

    const task = await Task.create({
      title: data.title,
      description: data.description || "",
      dueDate: new Date(data.dueDate),
      project: data.projectId,
      assignedTo: data.assignedTo,
      createdBy: req.user._id,
    });

    const populatedTask = await task.populate("project", "name");
    return res.status(201).json(populatedTask);
  } catch (error) {
    if (error?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({ message: "Failed to create task" });
  }
});

router.patch("/:taskId/status", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = updateTaskSchema.parse(req.body);

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.assignedTo) !== String(req.user._id) && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    task.status = status;
    await task.save();
    const populatedTask = await task.populate("project", "name");
    return res.json(populatedTask);
  } catch (error) {
    if (error?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({ message: "Failed to update task status" });
  }
});

module.exports = router;
