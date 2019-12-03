'use strict'

const { ForbiddenError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = process.env

const generateToken = ({ email, id }) => jwt.sign({ data: { email, id } }, TOKEN_SECRET, { expiresIn: '24h' })

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      return user.error ? { success: false, message: user.error } : { success: true, user }
    },
    recentFavorites: (_, __, { dataSources }) => dataSources.songAPI.recentFavorites(),
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
    addFavorite: async (_, { artist, name, reason }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.addFavorite({ artist, name, reason })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
    updateFavorite: async (_, { id, reason }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.updateFavorite({ id, reason })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
    removeFavorite: async (_, { id }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.removeFavorite({ id })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
  },
  Song: {
    user: async ({ userId }, _, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id: userId })
      // If null is returned here, entire Song will be returned as null
      return user.error ? null : user
    },
  },
  User: {
    favorites: ({ id }, _, { dataSources }) => dataSources.songAPI.findByUserId({ userId: id }),
  },
}
