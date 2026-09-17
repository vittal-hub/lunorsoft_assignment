# Student Task Management Application

A simple, secure, full-stack task manager built for students to organize their academic and personal tasks. Built as an interview-friendly project: no unnecessary abstractions, no advanced patterns — just a clean React + Express + MongoDB stack.

---

## 1. Project Description

Students can register, log in, and manage their own tasks — create, edit, delete, mark complete/pending, search, filter by status/priority, and see quick dashboard stats. Every task belongs to exactly one user, and the backend enforces that a user can only ever see or modify their own tasks.

---

## 2. Features

- User registration and login with hashed passwords
- JWT authentication stored in an HTTP-only cookie
- Create, edit, delete tasks
- Mark tasks completed/pending
- Search tasks by title/description
- Filter tasks by status (pending/completed) and priority (Low/Medium/High)
- Combine search + filters
- Due dates with an "Overdue" indicator for pending tasks past their due date
- Dashboard statistics: total, pending, completed
- Responsive UI (desktop, tablet, mobile)

---

## 3. Tech Stack

**Frontend:** React.js, Vite, JavaScript, Axios, React Router
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JWT + bcryptjs + HTTP-only cookies
**Other:** dotenv, cors, helmet, cookie-parser

No TypeScript, no Redux, no Next.js, no React Query — kept deliberately simple.

---

## 4. Architecture

```
React (Vite)
   ↓
Axios (withCredentials: true)
   ↓
Express REST API
   ↓
Authentication Middleware (verifies JWT cookie)
   ↓
Controller (business logic)
   ↓
Mongoose
   ↓
MongoDB
```

The frontend never talks to MongoDB directly. Every request goes through Express, which checks the JWT cookie before letting a request reach a task controller.

---

## 5. Folder Structure

```
lunorsoft_assignment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskList.jsx
    │   │   ├── FilterBar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── taskService.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 6. Authentication Flow

1. User registers or logs in with email + password.
2. Backend hashes the password with bcryptjs (registration) or compares it with bcryptjs (login).
3. On success, the backend signs a JWT containing the user's ID and sets it as an **HTTP-only cookie** (`token`) on the response.
4. The browser automatically sends this cookie on every subsequent request (`withCredentials: true` on Axios, matching CORS config on the server).
5. The `protect` middleware reads the cookie, verifies the JWT, and attaches `req.userId` to the request.
6. Task controllers use `req.userId` — never a value from the request body — to scope all queries to the logged-in user.
7. Logout clears the cookie.

Since the JWT lives in an HTTP-only cookie, client-side JavaScript can never read or steal it (mitigates XSS token theft).

---

## 7. Security Measures

- **Password hashing:** bcryptjs with a salt, never plain text.
- **JWT auth:** short-lived, signed with a secret from `.env`.
- **HTTP-only cookies:** JWT is inaccessible to JavaScript in the browser.
- **helmet:** sets safe HTTP headers.
- **CORS:** restricted to `CLIENT_URL` only, with `credentials: true`.
- **Backend validation:** every input is validated server-side (never trust the frontend alone).
- **Mongoose schema validation:** required fields, enums for priority, email format.
- **User-scoped queries:** every task lookup/update/delete filters by `{ user: req.userId }`, so one user can never touch another user's tasks.
- **No sensitive data in error responses:** generic messages are shown to the client; details are only logged server-side.
- **Environment variables:** all secrets (`JWT_SECRET`, `MONGO_URI`) come from `.env`, never hardcoded.

---

## 8. Database Schema

**User**
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, validated format |
| password | String | required, hashed, min 6 chars |
| createdAt | Date | default: now |

**Task**
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | optional |
| priority | String | enum: Low / Medium / High |
| dueDate | Date | required |
| completed | Boolean | default: false |
| user | ObjectId | ref: User, required |
| createdAt | Date | default: now |

---

## 9. API Endpoints

**Auth**
| Method | Route | Description | Protected |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login, sets JWT cookie | No |
| POST | /api/auth/logout | Clears JWT cookie | No |
| GET | /api/auth/me | Get logged-in user | Yes |

**Tasks**
| Method | Route | Description | Protected |
|---|---|---|---|
| GET | /api/tasks | Get user's tasks (supports `?status=`, `?priority=`, `?search=`) | Yes |
| GET | /api/tasks/:id | Get one task (only if owned by user) | Yes |
| POST | /api/tasks | Create a task | Yes |
| PUT | /api/tasks/:id | Update a task (only if owned by user) | Yes |
| DELETE | /api/tasks/:id | Delete a task (only if owned by user) | Yes |

---

## 10. Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files — they're in `.gitignore`.

---

## 11. Local Setup

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (local MongoDB or MongoDB Atlas)

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configure environment variables

Copy the example files and fill in real values:

```bash
cd backend
cp .env.example .env   # then edit MONGO_URI and JWT_SECRET

cd ../frontend
cp .env.example .env   # defaults work for local dev
```

### Run the backend

```bash
cd backend
npm run dev      # uses nodemon
# or
npm start
```
Backend runs at `http://localhost:5000`.

### Run the frontend

```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`.

Open `http://localhost:5173`, register a new account, and start managing tasks.

---

## 12. MongoDB Atlas Setup

1. Create a free account at mongodb.com/cloud/atlas.
2. Create a new free-tier cluster.
3. Under **Database Access**, create a user with a username/password.
4. Under **Network Access**, allow access from your IP (or `0.0.0.0/0` for development).
5. Click **Connect → Drivers**, copy the connection string.
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<password>` with your database user's password.

---

## 13. Deployment

**Frontend → Vercel or Netlify**
1. Push the `frontend` folder to a GitHub repo (or connect the monorepo and set the root directory to `frontend`).
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the environment variable `VITE_API_URL` pointing to your deployed backend URL (e.g. `https://your-backend.onrender.com/api`).

**Backend → Render**
1. Create a new Web Service on Render, connect your repo, set the root directory to `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL), `NODE_ENV=production`, `PORT` (Render sets this automatically).

**Database → MongoDB Atlas**
Use the same Atlas cluster from setup above; just make sure Network Access allows Render's outbound IPs (or `0.0.0.0/0`).

After deployment, update `CLIENT_URL` on the backend and `VITE_API_URL` on the frontend to point to the live URLs, and redeploy both.

---

## 14. Screenshots

_Add screenshots of the Login, Register, and Dashboard pages here._

---

## 15. Future Improvements

- Pagination for large task lists
- Task categories/tags
- Email verification on registration
- Password reset flow
- Dark mode

---

## 16. How I Would Explain This Project in an Interview

"This is a Student Task Management app where a user can register, log in, and manage their own to-do list securely. I used React with Vite for the frontend because it's fast to set up and doesn't need the complexity of a framework like Next.js for a project this size — plain React state (`useState`/`useEffect`) and Context API were enough, so I didn't need Redux.

For the backend, I used Express because it's minimal and lets me define REST routes directly without a lot of boilerplate. I used MongoDB with Mongoose because tasks and users are simple documents that don't need complex relational joins — Mongoose also gives me schema validation out of the box.

The frontend talks to the backend using Axios, configured with `withCredentials: true` so cookies are sent with every request. Authentication works with JWT: when a user logs in, the backend verifies their password with bcrypt, signs a JWT with their user ID, and sends it back as an HTTP-only cookie — so JavaScript in the browser can never read or steal that token, which protects against XSS-based token theft. On every protected request, a middleware reads that cookie, verifies the JWT, and attaches the user's ID to the request.

Every task in the database has a `user` field referencing the owner. In every controller — get, update, delete — I always filter the query by `{ user: req.userId }`, so a user can never see or modify another user's tasks, even if they guess a task ID.

CRUD is standard REST: POST to create, GET to list/read, PUT to update, DELETE to remove — each one scoped to the authenticated user. Search and filtering are done with query parameters on the GET /api/tasks endpoint — a MongoDB regex match on title/description for search, and simple equality filters for status and priority, all combinable in one query object.

For security, I used bcrypt for password hashing, JWT with HTTP-only cookies, helmet for secure headers, and CORS locked down to only my frontend's URL. All inputs are validated on the backend too, not just the frontend, since client-side validation can be bypassed.

For deployment, the frontend goes on Vercel, the backend on Render, and the database is hosted on MongoDB Atlas — three free, simple services that don't require managing any servers myself."

---

## 17. Interview Questions & Answers

1. **Explain your project.**
   A full-stack app where authenticated students can create, search, filter, and manage their own tasks, built with React, Express, and MongoDB.

2. **Why did you choose React?**
   It's component-based, has a huge ecosystem, and lets me manage UI state simply with hooks — no need for a heavier framework for this size of app.

3. **Why did you choose Express?**
   It's a minimal, unopinionated Node.js framework — perfect for building a small REST API quickly without extra boilerplate.

4. **Why MongoDB?**
   Tasks and users are simple, self-contained documents with no complex relational joins needed, so a NoSQL document database fits naturally.

5. **Why Mongoose?**
   It gives schema definitions, validation, and a simpler query API on top of the native MongoDB driver.

6. **What is a REST API?**
   An API that uses standard HTTP methods (GET, POST, PUT, DELETE) on resource-based URLs (like `/api/tasks/:id`) to perform CRUD operations.

7. **Explain your project architecture.**
   React sends requests via Axios to an Express REST API. Requests pass through an auth middleware that verifies the JWT cookie, then reach a controller, which uses Mongoose to read/write MongoDB.

8. **How does login work?**
   The user submits email/password, the backend looks up the user by email, compares the password with bcrypt, and if it matches, signs a JWT and sets it as an HTTP-only cookie.

9. **Why did you use JWT?**
   It's stateless — the server doesn't need to store session data, it can just verify the token's signature on each request.

10. **Why use HTTP-only cookies instead of localStorage?**
    HTTP-only cookies can't be accessed by JavaScript, which protects the token from being stolen via XSS attacks.

11. **Why hash passwords?**
    So that even if the database is compromised, attackers can't read the actual passwords.

12. **How does bcrypt work in your project?**
    On registration, `bcrypt.hash()` salts and hashes the password before saving. On login, `bcrypt.compare()` checks the plain password against the stored hash.

13. **How do you protect task routes?**
    An `authMiddleware` runs before every task route, verifies the JWT from the cookie, and rejects the request with 401 if it's missing or invalid.

14. **How do you make sure users only see their own tasks?**
    Every database query for tasks includes `{ user: req.userId }`, where `req.userId` comes from the verified JWT — never from the request body or params.

15. **Explain your create-task API.**
    POST `/api/tasks` validates title, priority, and dueDate, then creates a task with `user` set to the logged-in user's ID from the JWT.

16. **Explain your update-task API.**
    PUT `/api/tasks/:id` finds the task by ID and the logged-in user's ID together — if it doesn't match, it returns 404, so a user can't update someone else's task.

17. **How does delete work?**
    DELETE `/api/tasks/:id` uses `findOneAndDelete({ _id, user })`, again scoped to the current user.

18. **How does search work?**
    A MongoDB `$regex` (case-insensitive) match on `title` and `description`, combined with `$or`.

19. **How does filtering work?**
    Query parameters (`status`, `priority`) get added as extra conditions to the same MongoDB query object used for search.

20. **How does form validation work?**
    The frontend checks required fields before submitting (title, priority, dueDate, valid email, min password length). The backend re-validates everything independently, since frontend checks can be bypassed.

21. **How do you handle errors?**
    Try/catch blocks in every controller return appropriate HTTP status codes (400, 401, 404, 500) with simple, non-technical messages; the frontend displays these directly to the user.

22. **What happens if MongoDB is down?**
    The connection attempt in `db.js` fails, is logged, and the process exits early so the app doesn't run in a broken state; any query during a live app would hit the catch block and return a 500 with a generic message.

23. **How would you deploy this project?**
    Frontend on Vercel/Netlify, backend on Render, database on MongoDB Atlas — updating environment variables on each to point to the live URLs.

24. **What security measures did you implement?**
    Password hashing, JWT in HTTP-only cookies, helmet headers, restricted CORS, backend validation, and per-user data scoping.

25. **What would you improve in the future?**
    Add pagination, task categories, email verification, and a password reset flow.

---

## 18. Testing Checklist

**Authentication**
- [x] Register
- [x] Login
- [x] Logout
- [x] Invalid login shows "Invalid email or password"
- [x] Duplicate email is rejected
- [x] Dashboard route redirects to Login when unauthenticated
- [x] Task APIs return 401 when unauthenticated
- [x] A user cannot access another user's tasks (enforced by `{ user: req.userId }` filter on every query)

**Tasks**
- [x] Create task
- [x] View tasks (list)
- [x] View single task
- [x] Edit task
- [x] Delete task
- [x] Mark completed
- [x] Mark pending

**Search / Filter**
- [x] Search by title
- [x] Search by description
- [x] Filter pending
- [x] Filter completed
- [x] Filter by priority
- [x] Combine search + filters

**Other**
- [x] Due dates displayed
- [x] Overdue indicator on pending + past-due tasks
- [x] Dashboard statistics (total/pending/completed)
- [x] Frontend form validation
- [x] Backend validation (independent of frontend)
- [x] User-friendly error handling
- [x] Responsive UI (desktop/tablet/mobile)
- [x] Data persists in MongoDB

**Security**
- [x] Passwords hashed with bcryptjs
- [x] JWT authentication
- [x] HTTP-only cookie
- [x] Protected routes via middleware
- [x] User-specific task access
- [x] Helmet enabled
- [x] CORS restricted to `CLIENT_URL` with credentials
- [x] Secrets in environment variables
- [x] `.env` files ignored by Git

_Verified: backend syntax-checked (all files parse cleanly), frontend builds successfully with Vite, and full API flow (register → login → create/list/search/filter/update/delete task → logout) was exercised end-to-end against a MongoDB instance._
