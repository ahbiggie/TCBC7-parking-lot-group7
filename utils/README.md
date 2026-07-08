# Summary: Building `readRecords()`

## Goal:
 A utility function that reads `data/records.json` and returns its contents as a JS array safely, and usable anywhere in the app.

### Step 1 — Where the file belongs
- readRecords() lives in utils/recordsStorage.js.
- Reasoning: not business logic — that's services/ job.
- Naming was made specific (recordsStorage.js) since its job isn't generic file handling, it's specifically about records.

### Step 2 — Choosing the right fs API
- Used node:fs/promises, not callback-style fs.
- Reasoning: promise-based methods pair with async/await, avoid nested callbacks, and let you use try/catch for errors.

### Step 3 — Reading the file as text, not a Buffer
- fs.readFile(path, 'utf-8') — the second argument matters. Without it, you get a raw Buffer (Node reads the file as bytes and not readable text). JSON.parse expects text.

### Step 4 — Parsing JSON into a JS array
- JSON.parse(records) converts the file's text content into an actual array our code can .filter()/find() on.

### Step 5 — Resolving the file path reliably
- Relative paths ('../data/records.json') break depending on where node is run from.
- Fixed using fileURLToPath(import.meta.url) + path.dirname() to get __dirname in ESM, then path.join(__dirname, '../data', 'records.json') — steps up out of utils/ into the real data/ folder.

### Step 6 — Handling the "file doesn't exist" case
- Chose to try reading first, then catch the error.
- Specifically checks error.code === 'ENOENT' (file doesn't exist or is empty) and returns [] (empty array, not a string).

### Step 7 — Not swallowing unexpected errors
Any error that isn't ENOENT gets re-thrown, not silently handled — lets the Services layer decide what to do with unexpected failures (corrupted JSON, permission errors) instead of hiding them.

### Step 8 — Testing correctly
`readRecords()` is `async`, so calling it returns a Promise, not the array. Needed `await` to see the resolved value. Worked at the top level only because ESM supports top-level `await`.

### Common mistakes caught along the way:
Returning a string instead of `[]` on missing file; comparing an Error object directly instead of `error.code`; missing `utf-8` encoding; relative paths; testing an async function without `await`.
