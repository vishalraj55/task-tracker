# Task Tracker - MERN Stack

A full-stack task tracker built with MongoDB, Express, React (Vite), and Node.js.
Tasks are modeled as "ticket" entries in an operations log - each one carries a
status, priority, and optional due date, with full CRUD, filtering, sorting,
and toast notifications.

## Stack

- **Frontend:** React 18 + Vite, plain CSS (no framework), Axios
- **Backend:** Node.js + Express, Mongoose, express-validator
- **Database:** MongoDB (Atlas recommended for deployment)

## Project structure

```
task-tracker/
├── backend/
│   ├── config/db.js              # Mongoose connection
│   ├── models/Task.js            # Task schema + validation
│   ├── controllers/taskController.js
│   ├── routes/taskRoutes.js
│   ├── middleware/validateTask.js   # express-validator rules
│   ├── middleware/errorHandler.js   # centralized error handling
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/taskApi.js          # all backend calls live here
    │   ├── context/ToastContext.jsx
    │   ├── components/
    │   │   ├── TaskForm.jsx        # create + edit, shared
    │   │   ├── TaskList.jsx
    │   │   ├── TaskItem.jsx        # ticket card UI
    │   │   ├── FilterBar.jsx
    │   │   └── ConfirmModal.jsx
    │   ├── styles/index.css
    │   └── App.jsx
    └── .env.example
```

## Running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# paste your MongoDB Atlas connection string into MONGO_URI in .env
npm run dev
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (default is already correct for local dev)
npm run dev
```

App runs at `http://localhost:5173`.

## REST API

Base path: `/api/tasks`

| Method | Endpoint          | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | `/api/tasks`      | List tasks. Supports `?status=`, `?priority=`, `?search=`, `?sortBy=`, `?order=` |
| GET    | `/api/tasks/:id`  | Get one task                                 |
| POST   | `/api/tasks`      | Create a task                                |
| PUT    | `/api/tasks/:id`  | Update a task                                |
| DELETE | `/api/tasks/:id`  | Delete a task                                |

Task shape:

```json
{
  "title": "Refactor auth middleware",
  "description": "Optional, up to 500 chars",
  "status": "pending | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "2026-07-01"
}
```

All responses follow `{ success, data }` (or `{ success: false, message }` on error).
Validation runs both server-side (express-validator + Mongoose schema) and
client-side (in `TaskForm.jsx`) so bad requests never reach the database.

## Deployment (the path you already know from HTTPilot/Frameloop)

**Database - MongoDB Atlas**
1. Create a free cluster, add a database user, and allow access from anywhere (`0.0.0.0/0`) for now.
2. Copy the connection string - this is your `MONGO_URI`.

**Backend - Render**
1. New Web Service → connect the `backend/` folder of this repo.
2. Build command: `npm install` · Start command: `npm start`.
3. Environment variables: `MONGO_URI`, `CLIENT_URL` (your Vercel URL once you have it), `NODE_ENV=production`.
4. Render assigns the `PORT` env var automatically - `server.js` already reads `process.env.PORT`.

**Frontend - Vercel**
1. New Project → connect the `frontend/` folder.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Environment variable: `VITE_API_URL=https://<your-render-service>.onrender.com/api`.
4. Once deployed, go back to Render and set `CLIENT_URL` to your Vercel domain so CORS allows it.

Free Render services spin down when idle - the first request after a quiet
period takes a few seconds to wake up. UptimeRobot ping (same trick you used
for Frameloop) keeps it warm if you want snappier demos.

## Notes on what's "bonus" here

- **Filtering & sorting:** status chips + priority/sort dropdowns, all server-side via query params (not just client-side array filtering).
- **Notifications:** toast system via React Context, no extra dependency.
- **Reusable components:** `TaskForm` handles both create and edit; `ConfirmModal` is generic; all API calls are centralized in `taskApi.js`.
- **Env vars:** both `MONGO_URI`/`CLIENT_URL` (backend) and `VITE_API_URL` (frontend) are externalized, with `.env.example` templates checked in instead of real `.env` files.
