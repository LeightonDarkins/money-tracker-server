const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const moneyTrackerServerFormat = printf(info => {
  return `${info.timestamp} ${info.level.toUpperCase()} [${info.label}] ${info.message}`
})

module.exports = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'MoneyTrackerServer' }),
    timestamp(),
    moneyTrackerServerFormat
  ),
  transports: [
    new transports.Console({ filename: 'money-tracker-server.log' })
  ]
})
