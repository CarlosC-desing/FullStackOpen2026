/*

 ======================
//       3.1        //
=====================

*/
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());
/*

 ======================
//     3.7 - 3.8    //
=====================

*/
morgan.token("body", (request, response) => {
  const body = request.body;
  return JSON.stringify(body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

/*

 ======================
//       3.2        //
=====================

*/

app.get("/info", (request, response) => {
  const totalContacts = persons.length;
  const dateInfo = new Date();
  response.send(`
    <p>Phonebook has info for ${totalContacts} people</p>
    <p>${dateInfo}</p>`);
});

/*

 ======================
//       3.3        //
=====================

*/

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

/*

 ======================
//       3.4        //
=====================

*/

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

/*
 ======================
//     3.5  3.6     //
=====================
*/

const generateId = () => {
  const baseNumber = persons.length + 1;
  const idGenerated =
    Math.floor(Math.random() * (1000 - baseNumber + 1)) + baseNumber;

  return idGenerated;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const nameExists = persons.some(
    (p) => p.name.toLowerCase() === body.name?.toLowerCase(),
  );
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.use(express.static("dist"));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
