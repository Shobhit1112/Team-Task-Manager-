# 🗂️ Team Task Manager

A full-stack web application for managing team projects and tasks. Admins can create projects, add team members, assign tasks, and track progress — all in real time.

🌐 **Live App:** [https://hopeful-unity-production-8b94.up.railway.app](https://hopeful-unity-production-8b94.up.railway.app)

---

## 📸 Features

- 🔐 **Authentication** — Signup/Login with JWT tokens
- 👤 **Role-based access** — Admin and Member roles
- 📁 **Project Management** — Create and manage projects
- 👥 **Team Management** — Add members to projects
- ✅ **Task Management** — Create, assign, and track tasks
- 📊 **Dashboard** — Real-time stats (Total, Todo, In Progress, Done, Overdue)
- 🔄 **Status Updates** — Members can update task status

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool |
| Axios | API requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Validation |

### Deployment
| Service | Purpose |
|---|---|
| Railway | Frontend + Backend hosting |
| MongoDB Atlas | Cloud database |
| GitHub | Source control |

---

## 📁 Project Structure

```
Team-Task-Manager/
│
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Styles
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   └── index.js         # Express server entry
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Shobhit1112/Team-Task-Manager-.git
cd Team-Task-Manager-
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskdb
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` in your browser.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | Get all users (Admin) |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| POST | `/api/projects/:id/team` | Add members to project |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id/status` | Update task status |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get task stats |

---

## 👤 User Roles

### Admin
- Create projects
- Add team members to projects
- Create and assign tasks
- View all tasks in dashboard

### Member
- View assigned tasks
- Update task status (Todo → In Progress → Done)

---

## ☁️ Deployment

### Frontend (Railway - hopeful-unity)
- Root Directory: `/client`
- Build Command: `npm run build`
- Start Command: `npm run preview -- --host 0.0.0.0 --port 4173`
- Environment Variable: `VITE_API_URL=<backend-url>/api`

### Backend (Railway - Team-Task-Manager-)
- Root Directory: `/server`
- Start Command: `node src/index.js`
- Environment Variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT=5000`
  - `NODE_ENV=production`
  - `CLIENT_URL=<frontend-url>`

---

## 📝 License

MIT License — feel free to use and modify this project.

---

## 👨‍💻 Author

**Shobhit Tandon**
- GitHub: [@Shobhit1112](https://github.com/Shobhit1112)
