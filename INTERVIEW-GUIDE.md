# Learning and explaining this project

You did not study MERN before this. That is fine — this guide takes you from "what is Express" to answering interview questions confidently.

**One rule: do not memorise this file. Read a file of code, then read the matching section here, then go break the code on purpose and fix it.** Interviewers can tell the difference between memorised and understood within two follow-up questions.

---

## Part 1 — Learn it in this order

Roughly 4 focused days. Do not skip ahead; each step depends on the one before.

### Day 1 — Get it running and poke the backend

1. Follow the README setup until both terminals are running and you can add a task.
2. Open `server/server.js`. It is 40 lines. Read every one.
3. Install Postman. Send a `GET` to `http://localhost:5000/api/tasks`. Then a `POST` with a JSON body. Watch tasks appear in the UI when you refresh it.
4. **Break it:** comment out `app.use(express.json())` in `server.js`, restart, and try to create a task from Postman. It fails, because `req.body` is now `undefined`. Uncomment it.

> You just learned what middleware is. Middleware are functions that run on every request before your route does. `express.json()` reads the incoming JSON body and puts it on `req.body`.

### Day 2 — The database layer

1. Read `models/Task.js`. Six fields, that is all.
2. Read `controllers/taskController.js` top to bottom. Every function has the same shape: `try`, do a database call, `res.status(...).json(...)`, `catch`.
3. In MongoDB Atlas, click **Browse Collections** and look at your actual documents. Notice `_id`, `createdAt`, `updatedAt`, `__v`.
4. **Break it:** in `models/Task.js`, change `enum: ['low', 'medium', 'high']` to `enum: ['low', 'high']`. Restart, try to create a medium task. Read the error message you get back.

> You just learned what schema validation is. MongoDB itself does not enforce structure — Mongoose does, in your Node code, before the write happens.

### Day 3 — React state

1. Read `client/src/App.jsx`. Every piece of state is listed at the top with a comment.
2. Read `TaskForm.jsx`, then `TaskItem.jsx`.
3. **Break it:** in `App.jsx`, change `handleDelete` so it only calls the API and does not call `setTasks`. Delete a task. Nothing disappears until you refresh.

> You just learned why state matters. The screen is drawn from state. If state does not change, React has no reason to redraw anything.

4. **Break it again:** in `TaskForm.jsx`, delete `event.preventDefault()`. Submit the form. The whole page reloads.

### Day 4 — Trace and rehearse

1. Open DevTools → Network tab. Do every action in the app and watch the requests fire. Click one and look at the request body and the response.
2. Take the "click travels through the app" diagram in the README and say it out loud, from memory, five times.
3. Read Part 3 of this guide and answer each question in your own words, out loud. Not in your head — out loud. It is a different skill.

---

## Part 2 — The eight concepts you must be able to explain

### 1. What the four letters do

MongoDB stores the data. Express handles the URLs. React draws the screen. Node runs the JavaScript on the server. The reason people like MERN is that it is JavaScript everywhere, so you are not switching languages between frontend and backend.

### 2. Why the frontend and backend are separate

They are two separate programs on two ports: React on 5173, the API on 5000. They only talk over HTTP with JSON. This means you could replace the React app with a mobile app tomorrow and the backend would not change at all.

### 3. Middleware

Functions that run on every request, in the order you write them.

```js
app.use(cors());          // allow the browser to call us from a different port
app.use(express.json());  // parse the JSON body into req.body
```

Order matters. If `express.json()` came after your routes, `req.body` would be undefined inside them.

### 4. CORS

Browsers block a page on `localhost:5173` from calling `localhost:5000` by default — different port counts as a different origin. That is a security feature called the same-origin policy. `cors()` adds a response header telling the browser this is allowed.

If you remove `cors()` you get a CORS error in the browser console, but Postman still works fine — because Postman is not a browser and does not enforce it. That detail impresses people.

### 5. Schema and model

A **schema** describes what a task looks like: field names, types, rules. A **model** is what you actually use to read and write: `Task.find()`, `Task.create()`.

MongoDB is schemaless — it will happily store any shape. Mongoose adds the structure back on the application side, which is what gives us validation like `required` and `enum`.

### 6. State in React

State is any value that, when it changes, should redraw the screen. It is created with `useState`:

```js
const [tasks, setTasks] = useState([]);
```

Two rules that matter:

- **Never mutate state directly.** `tasks.push(newTask)` does nothing visible. React compares the old value to the new one, and a mutated array is still the same array. So we build a new one instead: `setTasks([created, ...tasks])`.
- **State lives in the closest component that needs it.** `tasks` lives in `App` because three children need it. `isEditing` lives inside `TaskItem` because nobody else cares.

### 7. Props and lifting state up

`App` owns the data and passes it down: `<TaskList tasks={visibleTasks} onDelete={handleDelete} />`.

Data flows down as props. Changes flow back up by calling a function that was passed down. `TaskItem` cannot delete anything itself — it calls `onDelete(id)` and lets `App` deal with it. This is called **lifting state up**, and it is the pattern the whole app is built on.

### 8. useEffect

Code that runs *after* React draws, for things that are not rendering — like fetching data.

```js
useEffect(() => {
  const timer = setTimeout(() => { /* fetch */ }, 400);
  return () => clearTimeout(timer);   // cleanup
}, [search]);
```

Three parts to know:

- The **function** is what runs.
- The **dependency array** `[search]` controls when: only when `search` changes. `[]` would mean once on mount.
- The **returned function** is cleanup. React runs it before the next effect. Here it cancels the pending timer, which is what makes the debounce work — type six letters, send one request instead of six.

---

## Part 3 — Questions you will get, and how to answer

**"Walk me through your project."**

> It is a task manager built on the MERN stack. React on the frontend, an Express REST API on Node, and MongoDB for storage with Mongoose as the layer in between. You can create tasks with a title, notes and a priority, mark them done, edit them inline, search them and delete them. I kept the backend split into models, controllers and routes so each file has one job. The most interesting part for me was the data flow — the frontend never holds the truth, it just displays whatever the API returns after each change.

Keep it to about 30 seconds, then stop and let them ask.

---

**"What happens when you click the delete button?"**

Trace it. `TaskItem` calls `onDelete(task._id)`, which is `App`'s `handleDelete`. That calls `api.deleteTask(id)`, which sends `DELETE /api/tasks/:id`. Express matches the route, the controller calls `Task.findByIdAndDelete`, Mongo removes the document, the server responds with the id. Back in React, `setTasks` filters that id out of the array and React redraws the list without it.

---

**"Why did you split routes and controllers?"**

> So each file has one reason to change. The route file is just a table of contents — you can read all eight endpoints in ten seconds. The controller holds the logic. If I added authentication I would only touch routes; if I changed how filtering works I would only touch the controller.

---

**"Why is `_id` used as the React key?"**

> React uses keys to tell list items apart between redraws, so it can update one row instead of rebuilding all of them. A key has to be unique and stable. MongoDB's `_id` is both. Array index would be wrong here, because deleting a task shifts every index after it and React would reuse the wrong element.

---

**"Where does the filtering happen?"**

This one is worth being precise about, because the answer is "both, deliberately":

> Search goes to the server, because it uses a MongoDB `$regex` query and a real dataset could be too big to send to the browser. The pending/completed filter runs in the browser with `Array.filter`, because those tasks are already loaded — a network round trip for something I can compute instantly would be wasteful.

---

**"What is the difference between PUT and PATCH here?"**

> `PUT /api/tasks/:id` updates the editable fields of the task. `PATCH /api/tasks/:id/toggle` only flips `completed`. I gave toggling its own endpoint because the checkbox should not have to send the whole task object back just to change one boolean.

---

**"How do you handle errors?"**

> Every controller is wrapped in try/catch and returns a proper status code — 400 for bad input, 404 when an id does not exist, 500 for anything unexpected — with a `message` field. On the frontend, `api.js` checks `response.ok` and throws with that message, and the components catch it and show it to the user instead of failing silently.

Worth knowing: `fetch` does **not** throw on a 404 or 500. It only rejects on a network failure. That is exactly why `handleResponse` in `api.js` checks `response.ok` manually. Interviewers ask this one a lot.

---

**"What would you improve if you had more time?"**

Have a real answer here. It shows judgement, and it is the question people most often fumble.

> Four things. First, authentication with JWT, so tasks belong to a user instead of being shared globally — right now anyone hitting the API sees every task. Second, pagination, because `Task.find()` returning everything will not scale past a few hundred tasks. Third, optimistic updates — the checkbox currently waits for the server before it visibly ticks, which feels slow. Fourth, tests; I have tested the endpoints manually in Postman but there is no automated test suite.

---

**"Why MongoDB and not SQL?"**

Be honest rather than pretending Mongo is universally better:

> For this app, tasks are self-contained documents with no relationships, so a document database fits naturally and I did not have to design a schema up front. If I added users, teams, shared projects and permissions — lots of relations — I would seriously consider Postgres instead. Here the flexibility was worth more than the joins.

---

## Part 4 — Handling what you do not know

You will be asked something you cannot answer. Everyone is. The answer is not to bluff — interviewers spot it immediately and it costs you far more than the gap did.

Say this instead:

> I have not used that yet. My understanding is that it is roughly ___ — is that right?

Then actually listen. Interviewers hire people who can say "I do not know" and stay curious. That is a much stronger signal than someone who guesses confidently and is wrong.

Also: **do not claim to have built this from scratch alone if you did not.** If asked, "I built it as a learning project, following a structure and reading through every part until I understood it" is a completely respectable answer. What they are testing is whether you understand the code in front of you. Explaining it clearly is the thing that counts, and by the time you finish Part 1 you will genuinely be able to.

---

## Part 5 — Make it yours

The fastest way to actually own this project is to add one feature yourself, without help. In rough order of difficulty:

1. **A due date.** Add `dueDate` to the schema, a date input to the form, and show it on each task. Touches every layer — the best first exercise.
2. **Sort by priority.** High tasks at the top. Try it in the controller with Mongo's `sort()`.
3. **A "clear all completed" button.** One new endpoint using `Task.deleteMany({ completed: true })`.
4. **Categories or tags,** with a filter for each.
5. **Dark mode.** Pure frontend — a state variable, a class on the wrapper, and a second set of CSS variables.

If you build even one of these unaided, you will stop feeling like you are explaining someone else's code. And when the interviewer asks "what did you find hardest?", you will have a real story instead of a rehearsed one.

Good luck.
