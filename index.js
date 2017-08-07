require('./config/node-config')

const port = process.env.PORT

const express = require('express')
const axios = require('axios')

let app = express();

// Enabled CORS From Everywhere
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/currency', (req, res) => {
  console.info('SERVER: getting USD to AUD rate')

  axios.get(`http://www.apilayer.net/api/live?access_key=${process.env.MONEY_TRACKER_APP_ID}&source=USD&currencies=AUD&format=1`)
  .then((data) =>{
    res.send(data.data.quotes)
  })
  .catch((error) => {
    res.status(500).send(error)
    console.error(error)
  })
})

app.listen(port, () => {
  console.info('SERVER: started on ' + port)
})

module.exports = { app }
