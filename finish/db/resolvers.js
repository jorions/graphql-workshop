'use strict'

const { ForbiddenError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = process.env

const generateToken = ({ email, id }) => jwt.sign({ data: { email, id } }, TOKEN_SECRET, { expiresIn: '24h' })

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      // The defaultResolverTest key is used to demonstrate the use of default vs defined resolvers
      return user.error
        ? { success: false, message: user.error }
        : { success: true, user: { ...user, defaultResolverTest: { innerKey: 'DEFAULT RESOLVER' } } }
    },
    recentFavorites: (_, __, { dataSources }) => dataSources.songAPI.recentFavorites(),
    song: async (_, { id }, { dataSources }) => {
      const song = await dataSources.songAPI.findById({ id })
      if (song.error) return { success: false, message: song.error }

      const { artist, name } = song
      const lyrics = await dataSources.lyricsAPI.getLyrics({ artist, name })
      return { success: true, song: { ...song, lyrics: lyrics.error ? null : lyrics } }
    },
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
  // DefaultResolverTest: {
  //   // This is a defined resolver. Uncomment to see it overwrite the default resolver.
  //   // Note that if the defaultResolverTest key is null or undefined, then this resolver will
  //   // never actually get hit.
  //   // Note that the 'parent' argument in this case is the full defaultResolverTest
  //   // object which enabled this resolver to get hit.
  //   innerKey: parent => {
  //     console.log(parent)
  //     return 'DEFINED RESOLVER'
  //   },
  // },
  Song: {
    user: async ({ userId }, _, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id: userId })
      // Return nothing when the user cannot be successfully fetched.
      // Because Song.user is non-nullable in our schema, returning null here does 2 things:
      // - Adds an error object to the "errors" key in the response
      // - Has null bubble up to the nearest nullable field (User), making it null,
      //   so we never have a Song returned without a user if a user is requested.
      return user.error ? null : user
    },
  },
  User: {
    favorites: ({ id }, _, { dataSources }) => dataSources.songAPI.findByUserId({ userId: id }),
  },
}
