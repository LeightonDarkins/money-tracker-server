const mongoose = require('mongoose')

const AccountSchema = mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  balance: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Account', AccountSchema)
