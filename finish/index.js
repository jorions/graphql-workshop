'use strict'

require('dotenv').config()

const { ApolloServer, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const UserAPI = require('./dataSources/user')
const LyricsAPI = require('./dataSources/lyrics')
const SongAPI = require('./dataSources/song')

const { TOKEN_SECRET } = process.env

const store = createModels()
const userAPI = new UserAPI({ store })
const lyricsAPI = new LyricsAPI()

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
      // Instead of refreshing the JWT we just respond with an AuthenticationError.
      // If we wanted, we could implement an error handling flow. Read about it here:
      // https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210
      throw new AuthenticationError('Invalid token. Log in again.')
    }
  },
  typeDefs,
  resolvers,
  // If you use this.context in your datasource, it's critical to create a new
  // instance in the dataSources function and to not share a single instance. Otherwise,
  // initialize may be called during the execution of async code for a specific user,
  // and replace this.context by the context of another user.
  dataSources: () => {
    return {
      userAPI,
      lyricsAPI,
      songAPI: new SongAPI({ store }),
    }
  },
})

server.listen(4000).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
