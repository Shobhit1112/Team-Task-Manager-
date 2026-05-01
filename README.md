# Team Task Manager (Full-Stack)

A full-stack web app where teams can create projects, assign tasks, and track progress with role-based access control (`Admin` / `Member`).

## Features

- Authentication (`Signup`, `Login`) with JWT
- Role-based authorization (`Admin`, `Member`)
- Project management (create/list projects)
- Team management (add members to projects)
- Task management (create, assign, update status)
- Dashboard stats (total, todo, in-progress, done, overdue)

## Tech Stack

- Frontend: React + Vite + Axios
- Backend: Node.js + Express + MongoDB (Mongoose)
- Validation: Zod
- Auth: JWT + bcrypt

## Folder Structure

- `client`: React frontend
- `server`: Express API

## Local Setup

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Set values in `server/.env`:

- `PORT=5000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_URL=http://localhost:5173`

### 2) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Set:

- `VITE_API_URL=http://localhost:5000/api`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects` (Admin only)
- `POST /api/projects/:projectId/team` (Admin only)
- `GET /api/tasks`
- `POST /api/tasks` (Admin in project team)
- `PATCH /api/tasks/:taskId/status` (Assignee or Admin)
- `GET /api/dashboard`

## Railway Deployment (Mandatory Requirement)

Deploy as **2 Railway services** from this monorepo:

1. **API Service**
   - Root Directory: `server`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT` (Railway provides this automatically)
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLIENT_URL` = `<frontend-railway-url>`

2. **Frontend Service**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `VITE_API_URL` = `<api-railway-url>/api`

After deploy, verify:

- Signup/Login works
- Admin can create project, add members, create tasks
- Member can view assigned tasks and update status
- Dashboard shows overdue and status counts

## Submission Checklist

- Live URL (Railway)
- GitHub repo URL
- Updated README
- 2-5 min demo video

## Demo Video Flow Suggestion (2-5 min)

1. Signup as Admin
2. Create project
3. Add team member
4. Create and assign task
5. Login as Member and update task status
6. Show dashboard and overdue status
