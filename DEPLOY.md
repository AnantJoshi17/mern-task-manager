# Deploying this project

Goal: a public URL you can put on your CV and open in front of an interviewer.

Everything below is free and needs no credit card. Budget about 30 minutes the first time.

We use **Render** for both the backend and the frontend, because the `render.yaml` file in this repo lets Render create both services in one step instead of you filling in forms twice.

---

## Before you start

You need three accounts, all free:

1. [MongoDB Atlas](https://www.mongodb.com/atlas) — the database
2. [GitHub](https://github.com) — where your code lives
3. [Render](https://render.com) — the host

**Important:** you have to create these accounts and log in yourself. Never paste your passwords or connection strings into a chat with an AI, including me.

---

## Step 1 — Create the database (10 min)

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free **M0** cluster. Any region near you is fine.
2. **Database Access** → Add New Database User. Pick a username and password. Write the password down — you will need it in a moment, and Atlas will not show it again.
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`).
   Render's servers do not have a fixed IP, so restricting this would block your own backend.
4. **Database** → Connect → Drivers. Copy the connection string. It looks like:

```
mongodb+srv://myuser:<password>@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
```

5. Fix it up in a text editor:
   - Replace `<password>` with your real password
   - Add the database name `taskmanager` right after `.net/`

Final result:

```
mongodb+srv://myuser:MyRealPassword@cluster0.ab1cd.mongodb.net/taskmanager?retryWrites=true&w=majority
```

> If your password has `@`, `#`, `/` or `:` in it, those characters break the URL. Easiest fix is to reset the password to letters and numbers only.

---

## Step 2 — Put the code on GitHub (5 min)

From inside the project folder:

```bash
git init
git add .
git commit -m "MERN task manager"
```

Create a new **empty** repo on GitHub (no README, no .gitignore — you already have both), then run the two commands GitHub shows you:

```bash
git remote add origin https://github.com/YOUR-USERNAME/mern-task-manager.git
git branch -M main
git push -u origin main
```

**Check before you push:** run `git status` and make sure `.env` is *not* in the list. It is already in `.gitignore`, so it should not be. Your database password lives in that file, and a public repo with a live database password in it is a genuinely bad day.

---

## Step 3 — Deploy both services (10 min)

1. Sign in to [Render](https://render.com) with your GitHub account.
2. **New → Blueprint**.
3. Pick your repository. Render finds `render.yaml` and shows you two services: `task-manager-api` and `task-manager-client`.
4. It will ask you for the environment variables marked `sync: false`. Fill them in:

| Service | Variable | Value |
|---|---|---|
| task-manager-api | `MONGO_URI` | your connection string from Step 1 |
| task-manager-api | `CLIENT_URL` | `https://task-manager-client.onrender.com` |
| task-manager-client | `VITE_API_URL` | `https://task-manager-api.onrender.com` |

5. Click **Apply**. Both services build. The first build takes a few minutes.

### Then check the real URLs

Render appends random characters if a service name is already taken, so you might get `task-manager-api-x7k2.onrender.com` instead. Once both services are live, look at their actual URLs at the top of each service page.

If either differs from what you typed, go to **Environment** on each service, correct the value, and redeploy. Getting these two wrong is the single most common reason a first deploy shows an empty page.

---

## Step 4 — Test it

1. Open your frontend URL. Wait — the first load takes up to a minute (see below).
2. Add a task. Refresh. It should still be there.
3. If it is not, open DevTools → Network and look at the failed request. The two usual causes:

| What you see | Fix |
|---|---|
| CORS error in console | `CLIENT_URL` on the API does not exactly match your frontend URL. No trailing slash. |
| Requests going to `localhost:5000` | `VITE_API_URL` was missing when the frontend built. Set it, then **Manual Deploy → Clear build cache & deploy**. |
| 500 errors from the API | Check the API service logs. Almost always a bad `MONGO_URI` or a missing Network Access rule. |

> Why clearing the cache matters: Vite bakes `VITE_API_URL` into the JavaScript at **build** time, not run time. Changing the variable does nothing until you rebuild. This is a great thing to understand — it is exactly the kind of detail interviewers probe.

---

## The one gotcha to know before a live demo

Render's free services **sleep after 15 minutes of inactivity**. The next request wakes them up, which takes 30 to 60 seconds. Your visitor sees a blank screen and assumes your app is broken.

So: **open your site two minutes before the interview** and leave the tab there. The backend will be warm and it will load instantly.

If someone asks about it, the honest answer is a good one:

> That is the free tier spinning down after inactivity. In production I would move to a paid instance that stays warm, or add a health-check ping to keep it alive.

---

## Alternative: Vercel for the frontend

If you want the frontend on Vercel instead (faster, and the `vercel.json` file is already in `client/`):

1. [vercel.com](https://vercel.com) → Add New → Project → import your repo
2. Set **Root Directory** to `client`
3. Add an environment variable: `VITE_API_URL` = your Render API URL
4. Deploy, then update `CLIENT_URL` on your Render API to the new `.vercel.app` address

Keep the backend on Render either way. Vercel's free plan is for personal, non-commercial projects, which a portfolio piece is.

---

## After deploying

Add both links to the top of your README:

```markdown
**Live demo:** https://task-manager-client.onrender.com
**API:** https://task-manager-api.onrender.com/api/tasks
```

That second link is worth including. An interviewer clicking it sees raw JSON coming out of your own API, which is a more convincing demonstration than any screenshot.
