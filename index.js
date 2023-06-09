// const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
}

app.use(cors());
app.use(express.json());
app.use(express.static("dist"))
app.use(requestLogger);

// Data

let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Routes

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = +request.params.id;
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end();
});

app.delete("/api/notes/:id", (request, response) => {
  const id = +request.params.id;
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
}

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
        error: "content missing",
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }
  notes = notes.concat(note);
  response.json(note);
});

// Middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({"error": "unknown endpoint"});
}
app.use(unknownEndpoint)

// Server

const PORT = process.env.PORT || 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
