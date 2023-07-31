const express = require('express')
const port = process.env.PORT||3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const app = express()
app.use(routes)
// start and listen on the Express server
app.listen(port, () => {
  console.log(`app is running on localhost:${port}`)
})