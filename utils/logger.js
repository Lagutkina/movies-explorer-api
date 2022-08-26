// импортируем нужные модули
const winston = require('winston');

const generalLogger = winston.createLogger({
  transports: [new winston.transports.Console({
    timestamp: true,
    level: 'info',
  }), new winston.transports.File({ filename: 'info.log' })],
  format: winston.format.json(),
});

module.exports = generalLogger;
