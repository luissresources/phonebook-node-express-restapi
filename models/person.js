const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

// create url
const password = process.env.DB_PASSWORD
const url = `mongodb+srv://luissresources:${password}@cluster0.fp2el.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(url)
  .then( () => {
    console.log('Connect to DB')
  })
  .catch( () => {
    console.log('connection error')
  })

// Schema
const PersonSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, minlength:3, required: true, unique: true },
  number: { type: Number, min:10000000, required: true }
})

PersonSchema.plugin(uniqueValidator)

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person', PersonSchema)




