const express = require('express')
const app = express()

app.get('/',(request, response) => {
    const headers = request.headers
    console.log({headers})
    response.status(200).end()
})

const PORT = 3001
app.listen(PORT)
console.log('server running')