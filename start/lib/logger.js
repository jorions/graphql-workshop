'use strict'

const bunyan = require('bunyan')

module.exports = bunyan.createLogger({ name: 'workshop-service', serializers: bunyan.stdSerializers })
