require('./config/node-config')

const port = process.env.PORT

const express = require('express')

let app = express();

// Enabled CORS From Everywhere
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/accounts', (req, res) => {
  console.info('SERVER: getting accounts')

  res.status(200).send([
    {
      id: '1',
      name: 'Transaction',
      balance: 20.47
    },
    {
      id: '2',
      name: 'Savings',
      balance: 400.57
    }
  ])
})

app.post('/account', (req, res) => {
  console.info('SERVER: creating account')

  res.status(201).send({})
})

app.listen(port, () => {
  console.info('SERVER: started on ' + port)
})

module.exports = { app }
