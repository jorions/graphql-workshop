'use strict'

require('dotenv').config()

const { ApolloServer } = require('apollo-server')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const UserAPI = require('./dataSources/user')
const SongAPI = require('./dataSources/song')

const store = createModels()
const userAPI = new UserAPI({ store })
const songAPI = new SongAPI({ store })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userAPI,
    songAPI,
  }),
})

server.listen(4000).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
