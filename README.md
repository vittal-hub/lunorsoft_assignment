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
**Validation:** Zod (backend request validation)
**Database:** MongoDB with Mongoose
**Auth:** JWT + bcryptjs + HTTP-only cookies
**Other:** dotenv, cors, helmet, cookie-parser

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
Zod Validation Middleware (validates req.body)
   ↓
Controller (business logic)
   ↓
Mongoose
   ↓
MongoDB
```

---

## 5. Authentication Flow

1. User registers or logs in with email + password.
2. Backend hashes the password with bcryptjs (registration) or compares it with bcryptjs (login).
3. On success, the backend signs a JWT containing the user's ID and sets it as an **HTTP-only cookie** (`token`) on the response.
4. The browser automatically sends this cookie on every subsequent request (`withCredentials: true` on Axios, matching CORS config on the server).
5. The `protect` middleware reads the cookie, verifies the JWT, and attaches `req.userId` to the request.
6. Task controllers use `req.userId` — never a value from the request body — to scope all queries to the logged-in user.
7. Logout clears the cookie.

Since the JWT lives in an HTTP-only cookie, client-side JavaScript can never read or steal it (mitigates XSS token theft).

---

## 6. Security Measures

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

## 7. Request Validation (Zod)

Backend request bodies are validated with [Zod](https://zod.dev) before they reach any controller.

```
backend/
├── validations/
│   ├── authValidation.js   # registerSchema, loginSchema
│   └── taskValidation.js   # createTaskSchema, updateTaskSchema
└── middleware/
    └── validate.js         # reusable middleware: validate(schema)
```

`validate.js` is a small factory function — it takes a Zod schema, runs `schema.safeParse(req.body)`, and either calls `next()` with the parsed data or responds with `400` and a list of field errors:

```js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }
  req.body = result.data;
  next();
};
```

It's applied directly in the route definitions:

```js
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.route("/").post(validate(createTaskSchema), createTask);
router.route("/:id").put(validate(updateTaskSchema), updateTask);
```

**Responsibility split** stays clean:
- **Zod** — validates shape/format of incoming request data.
- **Auth middleware** — checks whether the user is logged in.
- **Controller** — application logic only (no manual `if (!title)` checks anymore).
- **Mongoose** — schema-level database validation (a second safety net).

`updateTaskSchema` is `createTaskSchema.partial()` — since a `PUT` may only send one changed field (e.g. `{ completed: true }` when toggling a task), every field is optional on update but still type/format-checked when present.

Example invalid request:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","priority":"Urgent","dueDate":"not-a-date"}'
```

Response (`400 Bad Request`):

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" },
    { "field": "priority", "message": "Priority must be Low, Medium, or High" },
    { "field": "dueDate", "message": "Due date must be a valid date" }
  ]
}
```

The frontend's `getErrorMessage()` helper (`frontend/src/services/api.js`) reads `err.response.data.errors` and joins the messages into one readable string shown in the form's error banner — no stack traces or internal details ever reach the UI.

---

## 8. Database Schema

**User**
| Field | Type | Notes |

| name | String | required |
| email | String | required, unique, validated format |
| password | String | required, hashed, min 6 chars |
| createdAt | Date | default: now |

**Task**
| Field | Type | Notes |

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

| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login, sets JWT cookie | No |
| POST | /api/auth/logout | Clears JWT cookie | No |
| GET | /api/auth/me | Get logged-in user | Yes |

**Tasks**
| Method | Route | Description | Protected |

| GET | /api/tasks | Get user's tasks (supports `?status=`, `?priority=`, `?search=`) | Yes |
| GET | /api/tasks/:id | Get one task (only if owned by user) | Yes |
| POST | /api/tasks | Create a task | Yes |
| PUT | /api/tasks/:id | Update a task (only if owned by user) | Yes |
| DELETE | /api/tasks/:id | Delete a task (only if owned by user) | Yes |

---

## 10. Local Setup

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
````

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

## 11. MongoDB Atlas Setup

1. Create a free account at mongodb.com/cloud/atlas.
2. Create a new free-tier cluster.
3. Under **Database Access**, create a user with a username/password.
4. Under **Network Access**, allow access from your IP (or `0.0.0.0/0` for development).
5. Click **Connect → Drivers**, copy the connection string.
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<password>` with your database user's password.

---

## 12. Screenshots

---

## 13. Future Improvements

- Pagination for large task lists
- Task categories/tags
- Email verification on registration
- Password reset flow
- Dark mode

---

## 14. Testing Checklist

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

**Zod Validation** (tested live against a running server + MongoDB Atlas)

- [x] Invalid registration (short name, bad email, short password) → `400` with field errors
- [x] Invalid login (missing password, bad email format) → `400` with field errors
- [x] Empty/whitespace-only task title → `400`, "Title is required"
- [x] Invalid priority value → `400`, "Priority must be Low, Medium, or High"
- [x] Invalid due date → `400`, "Due date must be a valid date"
- [x] Invalid `completed` value (non-boolean) → `400`
- [x] Valid task creation → `201`, task saved
- [x] Valid partial task update (e.g. `{ completed: true }` only) → `200`, task updated
- [x] Existing functionality (search, filters, delete, logout, 401 after logout) still works unchanged
