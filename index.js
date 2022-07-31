const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  {
    id: 1,
    name: 'Cristina Estrada',
    number: 322,
    key: 1
  },
  {
    id: 2,
    name: 'Sebastian Sanchez',
    number: 320,
    key: 2
  },
  {
    id: 3,
    name: 'Luis Sanchez',
    number: 350,
    key:3
  }
]

morgan.token('dataPost', function getId (req) {
  const body = JSON.stringify(req.body)
  return body
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status - :response-time ms :dataPost'))

app.get('/', (req, res) => 
  res.send('hello, world!')
)

app.get('/api/persons',(request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  person
    ? response.status(200).json(person)
    : response.status(404).json({
      error: 'person not found'
    })  
})

app.get('/info', (request, response) => {
  const quantityPersons = persons.length
  const requestDate = new Date()
  const txt = `<p>Phonebook has info for ${quantityPersons} people</p><p>${requestDate}</p>`
  response.status(200).send(txt)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const name = req.body.name
  const number = req.body.number
  const key = req.body.key
  const id = req.body.id

  if(!name && !number){
    return res.status(400).json({
      error: 'missing content'
    })
  }

  if(!name) {
    return res.status(400).json({
      error: `name not found`
    })
  } 
  
  if (!number) {
    return res.status(400).json({
      error: `number not found`
    })
  }

  const valName = persons.some(p => p.name.toLowerCase() === name.toLowerCase())

  if(valName) {
    return res.status(400).json({
       error: `name has already been added`
    })
  }

  const newPerson = {
    id : id,
    name : name, 
    number : number,
    key: key
  }

  // console.log('backend ',newPerson.id,' ',newPerson.name,' ',newPerson.number,' ',newPerson.key)

  // console.log(JSON.stringify(newPerson))

  persons = [...persons, newPerson]

  res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})


const PORT = 3001
app.listen(PORT)
console.log('server running')