'use strict'

const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = process.env

const generateToken = ({ email, id }) => jwt.sign({ data: { email, id } }, TOKEN_SECRET, { expiresIn: '24h' })

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      return user.error ? { success: false, message: user.error } : { success: true, user }
    },
    recentFavorites: () => {},
    song: async (_, { id }) => {},
  },
  Mutation: {
    signUp: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.signUp({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)
      return { success: true, token }
    },
    logIn: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.logIn({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)
      return { success: true, token }
    },
    addFavorite: async (_, { artist, name, reason }) => {},
    updateFavorite: async (_, { id, reason }) => {},
    removeFavorite: async (_, { id }) => {},
  },
  Song: {
    user: async ({ userId }) => {},
  },
  User: {
    favorites: ({ id }) => {},
  },
}
