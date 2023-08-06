const express = require('express')
const port = process.env.PORT||3000
const exphbs = require('express-handlebars')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bodyParser = require('body-parser')
const routes = require('./routes')
const app = express()
require('./config/mongoose')
//express tamplate engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(routes)
// start and listen on the Express server
app.listen(port, () => {
  console.log(`app is running on localhost:${port}`)
})