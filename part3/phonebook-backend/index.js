import 'dotenv/config'
import express, { request, response } from 'express'
import Person from './models/person.js';
import cors from 'cors'
import morgan from 'morgan';
const app = express();

app.use(express.json());

app.use(express.static("dist"));

morgan.token("body", (request, response) => {
  const body = request.body;
  return JSON.stringify(body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'nalformatterd id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
});

app.get("/info", (request, response) => {
  const dateInfo = new Date();
  Person.countDocuments({})
    .then(persons => {
      response.send(`
      <p>Phonebook has info for ${persons} people</p>
      <p>${dateInfo}</p>`);
    })
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});


app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: "name must be unique",
        });
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })

        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
