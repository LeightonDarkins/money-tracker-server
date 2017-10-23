const express = require('express')
const bodyParser = require('body-parser')

module.exports = express().use(bodyParser.json())
