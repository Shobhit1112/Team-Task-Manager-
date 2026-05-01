import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE_URL });

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ projectId: "", memberIds: [] });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", dueDate: "", projectId: "", assignedTo: "" });

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    if (!token) return;
    api.get("/auth/me", authHeaders).then(({ data }) => setUser(data)).catch(handleLogout);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [statsRes, projectRes, taskRes] = await Promise.all([
        api.get("/dashboard", authHeaders),
        api.get("/projects", authHeaders),
        api.get("/tasks", authHeaders),
      ]);

      setStats(statsRes.data);
      setProjects(projectRes.data);
      setTasks(taskRes.data);

      if (user?.role === "Admin") {
        const teamUsers = projectRes.data.flatMap((project) => project.team || []);
        const uniqueUsers = [...new Map(teamUsers.map((member) => [member._id, member])).values()];
        setAllUsers(uniqueUsers);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const { data } = await api.post(endpoint, payload);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    try {
      await api.post("/projects", projectForm, authHeaders);
      setProjectForm({ name: "", description: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleAddTeamMembers = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/projects/${memberForm.projectId}/team`, memberForm, authHeaders);
      setMemberForm({ projectId: "", memberIds: [] });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add team members");
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    try {
      await api.post("/tasks", taskForm, authHeaders);
      setTaskForm({ title: "", description: "", dueDate: "", projectId: "", assignedTo: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status }, authHeaders);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!token || !user) {
    return (
      <main className="container auth">
        <h1>Team Task Manager</h1>
        <p>Signup/Login to manage projects and track team progress.</p>
        <form className="card" onSubmit={handleAuth}>
          {authMode === "signup" && (
            <>
              <input
                placeholder="Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                required
              />
              <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </>
          )}
          <input
            placeholder="Email"
            type="email"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
          />
          <button type="submit">{authMode === "login" ? "Login" : "Signup"}</button>
          <button type="button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
            Switch to {authMode === "login" ? "Signup" : "Login"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>Team Task Manager</h1>
          <p>{user.name} ({user.role})</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="grid stats">
        <article className="card"><h3>Total</h3><p>{stats.total}</p></article>
        <article className="card"><h3>Todo</h3><p>{stats.todo}</p></article>
        <article className="card"><h3>In Progress</h3><p>{stats.inProgress}</p></article>
        <article className="card"><h3>Done</h3><p>{stats.done}</p></article>
        <article className="card"><h3>Overdue</h3><p>{stats.overdue}</p></article>
      </section>

      {user.role === "Admin" && (
        <section className="grid">
          <form className="card" onSubmit={handleCreateProject}>
            <h2>Create Project</h2>
            <input
              placeholder="Project name"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />
            <button type="submit">Create Project</button>
          </form>

          <form className="card" onSubmit={handleAddTeamMembers}>
            <h2>Add Team Members</h2>
            <select
              value={memberForm.projectId}
              onChange={(e) => setMemberForm({ ...memberForm, projectId: e.target.value })}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
            <select
              multiple
              value={memberForm.memberIds}
              onChange={(e) =>
                setMemberForm({
                  ...memberForm,
                  memberIds: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
            >
              {allUsers.map((member) => (
                <option key={member._id} value={member._id}>{member.name} ({member.role})</option>
              ))}
            </select>
            <button type="submit">Add Members</button>
          </form>

          <form className="card" onSubmit={handleCreateTask}>
            <h2>Create Task</h2>
            <input
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Task description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
            />
            <select
              value={taskForm.projectId}
              onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
            <select
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              required
            >
              <option value="">Select assignee</option>
              {allUsers.map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
            <button type="submit">Create Task</button>
          </form>
        </section>
      )}

      <section className="card">
        <h2>My Tasks</h2>
        {tasks.length === 0 && <p>No tasks assigned yet.</p>}
        {tasks.map((task) => (
          <div key={task._id} className="taskRow">
            <div>
              <strong>{task.title}</strong>
              <p>{task.project?.name} - Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <select
              value={task.status}
              onChange={(e) => handleTaskStatus(task._id, e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
