const mongoose = require('mongoose')
require('dotenv').config()

// create url
const password = process.env.DB_PASSWORD
const url = `mongodb+srv://luissresources:${password}@cluster0.fp2el.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(url)
  .then(result => {
    console.log('Connect to DB')
  })
  .catch(error => {
    console.log('connection error')
  })

// Schema
const PersonSchema = new mongoose.Schema({
  _id: {type: String, require: true },
  name: String,
  number: String,
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person', PersonSchema)




