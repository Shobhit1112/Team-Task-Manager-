const express = require("express");
const { z } = require("zod");
const { auth, requireAdmin } = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");

const router = express.Router();

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

const teamSchema = z.object({
  memberIds: z.array(z.string()).min(1),
});

router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ team: req.user._id })
    .populate("team", "name email role")
    .sort({ createdAt: -1 });
  res.json(projects);
});

router.post("/", auth, requireAdmin, async (req, res) => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await Project.create({
      ...data,
      createdBy: req.user._id,
      team: [req.user._id],
    });
    return res.status(201).json(project);
  } catch (error) {
    if (error?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({ message: "Failed to create project" });
  }
});

router.post("/:projectId/team", auth, requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberIds } = teamSchema.parse(req.body);

    const users = await User.find({ _id: { $in: memberIds } });
    if (users.length !== memberIds.length) {
      return res.status(400).json({ message: "One or more members not found" });
    }

    const project = await Project.findOne({ _id: projectId, team: req.user._id });
    if (!project) {
      return res.status(404).json({ message: "Project not found or not accessible" });
    }

    project.team = Array.from(new Set([...project.team.map(String), ...memberIds, String(req.user._id)]));
    await project.save();

    const updated = await project.populate("team", "name email role");
    return res.json(updated);
  } catch (error) {
    if (error?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({ message: "Failed to update team" });
  }
});

module.exports = router;
