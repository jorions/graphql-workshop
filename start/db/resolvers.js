'use strict'

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
    signUp: async (_, { email, password }) => {},
    logIn: async (_, { email, password }) => {},
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
