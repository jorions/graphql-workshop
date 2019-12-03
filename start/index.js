'use strict'

require('dotenv').config()

const { ApolloServer, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const UserAPI = require('./dataSources/user')
const SongAPI = require('./dataSources/song')

const { TOKEN_SECRET } = process.env

const store = createModels()
const userAPI = new UserAPI({ store })

const server = new ApolloServer({
  context: async ({ req }) => {
    const auth = req.headers && req.headers.authorization
    if (!auth) return null
    try {
      const {
        data: { id },
      } = jwt.verify(auth, TOKEN_SECRET)
      return { userId: id }
    } catch (err) {
      throw new AuthenticationError('Invalid token. Log in again.')
    }
  },
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      userAPI,
      songAPI: new SongAPI({ store }),
    }
  },
})

server.listen(4000).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
