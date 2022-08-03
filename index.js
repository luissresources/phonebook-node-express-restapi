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
    .then(result => {
      response.json(result)
    })
})

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      // WAITING NEW IMPLEMENTATION
      // console.log({error})
      // response.status(400).send({
      //   error: 'malformatted id'
      // })
      next(error)
    })
})
|
app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const quantityPersons = persons.length
      const requestDate = new Date()
      const txt = `<p>Phonebook has info for ${quantityPersons} people</p><p>${requestDate}</p>`
      response.status(200).send(txt)
    })
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body
  const name = request.body.name
  const number = request.body.number
  const key = request.body.key
  const id = request.body.id

  if(!name && !number){
    return response.status(400).json({
      error: 'missing content'
    })
  }

  if(!name) {
    return response.status(400).json({
      error: `name not found`
    })
  } 
  
  if (!number) {
    return response.status(400).json({
      error: `number not found`
    })
  }

  Person.find({})
    .then(persons => {
      const maxId = persons.length === 0 ? 1 : persons.length === 1 ? 2 : Math.max(...persons.map(person => person.id)) + 1
      const maxKey = persons.length === 0 ? 1 : persons.length === 1 ? 2 : Math.max(...persons.map(person => person.key)) + 1
      // created object user 
      const person = new Person({
        _id : maxId,
        key : maxKey,
        name : name,
        number: number
      })

      console.log(person._id,person.key, person.name, person.number)

      person.save()
        .then(result => {
          response.status(201).send({
            message: 'User created',
            result
          })
        })
        .catch(error => {
          response.status(400).send({
            error: 'User not created'
          })
        })
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response) => {
  console.log(request.body)
  Person.updateOne({_id : request.params.id}, {$set: {number: request.body.number}})
    .then(result => {
      response.status(200).send({
        message: 'User update',
        result
      })
    })
    .catch(error => {
      response.status(400).send({
        error : 'User not update',
        error
      })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne({_id : request.params.id})
    .then(result => {
      response.status(204).send({
        message: 'Content delete'
      })
    })
    .catch(error => {
      response.status(404).end()
    })
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
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})