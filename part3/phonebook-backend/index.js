/*

 ======================
//       3.1        //
=====================

*/
import 'dotenv/config'
import express, { request, response } from 'express'
import Person from './models/person.js';
import morgan from 'morgan';
const app = express();

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

app.get("/api/persons", (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  /*
   ======================
  //     3.14         //
  =====================
  */

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

        person.save().then(savedPerson => {
          response.json(savedPerson)
        })
      }
    });


});

app.use(express.static("dist"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
