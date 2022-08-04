// AUXILIARY PROGRAM
const mongoose = require('mongoose')
require('dotenv').config()


// create url
const password = process.argv[2]
const url = `mongodb+srv://luissresources:${password}@cluster0.fp2el.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(url)

// Schema
const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
})

// Model
const Person = mongoose.model('person', PersonSchema)

// Passing as parameter only the password
if(process.argv.length === 3) {
  // Show all users
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  // Create user
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`add ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}





