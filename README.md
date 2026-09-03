# Task Manager — a MERN stack project

A task manager where you can add, edit, complete, search and delete tasks. Everything is saved in a real database, so tasks are still there after a refresh.

Built as a first MERN project: small enough to understand every line, complete enough to talk about in an interview.

----

## What MERN means
=
| Letter | Tool | What it does here |
|---|---|---|
| **M** | MongoDB | The database. Stores each task as a document. |
| **E** | Express | The web framework on the server. Turns URLs like `/api/tasks` into functions. |
| **R** | React | The user interface running in the browser. |
| **N** | Node.js | The runtime that lets JavaScript run outside the browser, so the server can be JavaScript too. |

The point of MERN: **one language, JavaScript, from the database to the button you click.**

---

## How a click travels through the app

Say you tick a checkbox:

```
[React]  You click the checkbox in TaskItem.jsx
   |     onChange fires -> calls onToggle(task._id)
   v
[React]  App.jsx calls api.toggleTask(id)
   |     which sends: PATCH http://localhost:5000/api/tasks/123/toggle
   v
[Express] server.js receives it, cors() and express.json() run
   |      routes/taskRoutes.js matches the URL -> calls toggleTask()
   v
[Express] controllers/taskController.js flips completed and calls .save()
   |
   v
[MongoDB] Mongoose writes the change to the tasks collection
   |
   v
[Express] sends the updated task back as JSON
   |
   v
[React]  App.jsx puts it into state -> React redraws that one row
```

Learn to say this out loud. It is the single most useful thing you can explain about this project.

---

## Quick start

You need [Node.js](https://nodejs.org) installed. Then, from inside this folder:

**Mac / Linux**
```bash
bash setup.sh
```

**Windows**
```
setup.bat
```

That installs everything, creates your `.env` files, and opens VS Code. Then put your MongoDB connection string in `server/.env` (Step 1 below explains how to get one) and run:

```bash
npm run dev
```

That starts the backend and frontend together. Open `http://localhost:5173`.

To deploy it to a public URL, see **`DEPLOY.md`**.

---

## Setting it up manually

If you would rather do it step by step — and for learning, you should at least read this.

### Step 1 — get a database

**Easiest option (free, no install): MongoDB Atlas**

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) so your laptop can connect.
4. Click **Connect → Drivers** and copy the connection string. It looks like
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/`

**Or install MongoDB locally** and use `mongodb://127.0.0.1:27017/taskmanager`.

### Step 2 — start the backend

```bash
cd server
npm install
```

Make a file called `.env` inside the `server` folder (copy `.env.example` and rename it), then fill it in:

```
PORT=5000
MONGO_URI=your-connection-string-here/taskmanager
```

Then run it:

```bash
npm run dev
```

You should see `Server running on http://localhost:5000` and `MongoDB connected: ...`.

### Step 3 — start the frontend

Open a **second terminal** — the backend has to keep running in the first one.

```bash
cd client
npm install
npm run dev
```

Open the link it prints, usually `http://localhost:5173`.

---

## Project structure

```
mern-task-manager/
├── setup.sh / setup.bat         one-command setup
├── package.json                 runs both halves with `npm run dev`
├── render.yaml                  tells Render how to deploy both services
├── README.md                    this file
├── DEPLOY.md                    how to put it online
├── INTERVIEW-GUIDE.md           how to learn and explain it
│
├── server/                      the backend (Node + Express + MongoDB)
│   ├── server.js                entry point: middleware, routes, starts listening
│   ├── config/db.js             connects to MongoDB
│   ├── models/Task.js           what a task looks like in the database
│   ├── controllers/
│   │   └── taskController.js    the actual logic for each endpoint
│   └── routes/taskRoutes.js     which URL runs which controller function
│
└── client/                      the frontend (React)
    ├── index.html               the single HTML page
    └── src/
        ├── main.jsx             mounts React into the page
        ├── App.jsx              holds all shared state
        ├── api.js               every fetch call to the backend
        ├── index.css            all styling
        └── components/
            ├── TaskForm.jsx     the add-a-task form
            ├── Toolbar.jsx      search box + filter buttons
            ├── ProgressStrip.jsx  the bar showing how much is done
            ├── TaskList.jsx     loading / empty / list decision
            └── TaskItem.jsx     one task row, with inline editing
```

The backend is split into **model / controller / route** on purpose. Each file has one job, so when something breaks you know where to look.

---

## The API

Base URL: `http://localhost:5000/api/tasks`

| Method | Path | What it does |
|---|---|---|
| GET | `/api/tasks` | Get all tasks, newest first |
| GET | `/api/tasks?status=pending` | Only unfinished tasks |
| GET | `/api/tasks?status=completed` | Only finished tasks |
| GET | `/api/tasks?search=milk` | Tasks whose title contains "milk" |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/toggle` | Flip done / not done |
| DELETE | `/api/tasks/:id` | Delete a task |

Example body for POST and PUT:

```json
{
  "title": "Revise Express middleware",
  "description": "Focus on the order they run in",
  "priority": "high"
}
```

Try these in [Postman](https://www.postman.com/downloads/) or Thunder Client. Being able to open Postman and demo your API without the UI is a strong move in an interview.

---

## When something goes wrong

| What you see | What it usually means |
|---|---|
| `MongoDB connection failed` | Wrong `MONGO_URI`, or your IP is not allowed in Atlas Network Access |
| `Failed to fetch` in the browser console | The backend is not running, or `cors()` was removed from `server.js` |
| Tasks do not appear | Check the Network tab in DevTools — is the request going to port 5000? |
| `EADDRINUSE` | Port 5000 is already used. Change `PORT` in `.env` and in `client/src/api.js` |
| `Cannot find module` | You forgot `npm install` in that folder |

---

## Read `INTERVIEW-GUIDE.md` next

It walks through the code in the order you should learn it, and gives you answers to the questions you will actually be asked.
