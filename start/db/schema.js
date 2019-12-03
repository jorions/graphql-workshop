'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    # Get info for a user
    user(id: ID!): UserResponse!
    # Get most recently-favorited songs on site
    # Don't return a SongResponse because if there is a failure it is a straight
    # up error, not something like a non-existent ID
    recentFavorites: [Song]!
    # Get full song info, including lyrics
    song(id: ID!): SongResponse!
  }

  type Mutation {
    # Create user account
    signUp(email: String!, password: String!): UserResponse!
    # Log user in
    logIn(email: String!, password: String!): UserResponse
    # Add song to user favorites
    addFavorite(artist: String!, name: String!, reason: Reason!): SongResponse!
    # Update reason for song favorite
    updateFavorite(id: ID!, reason: Reason!): SongResponse!
    # Remove song from user favorites
    removeFavorite(id: ID!): SongResponse!
  }

  type UserResponse {
    success: Boolean!
    "A failure code"
    message: String
    "A JWT-encoded token"
    token: String
    user: User
  }

  type SongResponse {
    success: Boolean!
    "A failure code"
    message: String
    song: Song
  }

  type User {
    id: ID!
    email: String!
    favorites: [Song]!
  }

  type Song {
    id: ID!
    artist: String!
    name: String!
    lyrics: String
    reason: Reason!
    createdAt: String!
    user: User!
  }

  enum Reason {
    LYRICS
    SOUND
    EVERYTHING
  }
`

module.exports = typeDefs
