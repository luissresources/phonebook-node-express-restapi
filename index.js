const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const app = express()

morgan.token('dataPost', function getId (req) {
  const body = JSON.stringify(req.body)
  return body
})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status - :response-time ms :dataPost'))

app.get('/api/persons',(request, response) => {
  Person.find({})
    .then(persons => response.json(persons))
})

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person
        ? response.json(person)
        : response.status(404).end()
    })
    .catch(error => next(error))
})
|
app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const txt = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
      response.status(200).send(txt)
    })
})

app.post('/api/persons', (request, response,next) => {

  Person.find({})
    .then(persons => {
      const maxId = persons.length === 0 ? 1 : persons.length === 1 ? 2 : Math.max(...persons.map(person => person.id)) + 1
      // created object user 
      const person = new Person({
        _id : maxId,
        name : request.body.name,
        number: request.body.number
      })

      console.log(person._id, person.name, person.number)

      person.save()
        .then(personSaved => {
          response.status(201).send({
            message: 'User created',
            personSaved
          })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
  })

app.put('/api/persons/:id', (request, response, next) => {
  console.log(request.body)
  Person.findOneAndUpdate({_id: request.params.id}, {number: request.body.number}, { runValidators: true })
    .then(person => {
      if (person === null){
        response.status(400).send({
          message: 'Update error'
        })
      } else {
        response.status(200).send({
          message: 'User update',
          person
        })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(personToDelete => {
      response.status(204).send({
        message: 'Content delete',
        personToDelete
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError') {
    return response.status(400).send({
      error: 'mailformatted id'
    })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})