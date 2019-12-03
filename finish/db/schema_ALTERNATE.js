'use strict'

const { gql } = require('apollo-server')

// This alternate schema shows the use of inputs and interfaces

const typeDefs = gql`
  type Query {
    user(id: ID!): UserResponse!
    recentFavorites: [Song]!
    song(id: ID!): SongResponse!
  }

  type Mutation {
    signUp(user: UserInput): TokenResponse!
    logIn(user: UserInput): TokenResponse!
    addFavorite(artist: String!, name: String!, reason: Reason!): SongResponse!
    updateFavorite(id: ID!, reason: Reason!): SongResponse!
    removeFavorite(id: ID!): SongResponse!
  }

  # Added
  input UserInput {
    email: String!
    password: String!
  }

  # Added
  interface BaseUserResponse {
    success: Boolean!
    "A failure code"
    message: String
  }

  # The BaseUserResponse contains success and message, so we must implement them here
  type UserResponse implements BaseUserResponse {
    success: Boolean!
    "A failure code"
    message: String
    user: User
  }

  # The BaseUserResponse contains success and message, so we must implement them here
  type TokenResponse implements BaseUserResponse {
    success: Boolean!
    "A failure code"
    message: String
    "A JWT-encoded token"
    token: String
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
`

/*
Can query the browser with:

query User($id: ID!) {
  user(id: $id) {
    success
    message
    user {
    	email
    }
  }
}

query LogIn($user: UserInput!) {
  logIn(user: $user) {
    success
    message
    token
  }
}

mutation SignUp($user: UserInput!) {
  signUp(user: $user) {
    success
    message
    token
  }
}

{
  "user": {
    "email": "test@email.com",
  	"password": "test"
  },
  "id": 1
}

===========

We will need to update the 2nd argument in the logIn and signUp resolvers
  from: { email, password }
  to: { user: { email, password } }

===========

We could also add fragments to our queries with something like:

fragment UserResponseFields on UserResponse {
  success
  message
}

fragment TokenResponseFields on TokenResponse {
  success
  message
}

query User($id: ID!) {
  user(id: $id) {
    ...UserResponseFields
    user {
    	email
    }
  }
}

query LogIn($user: UserInput!) {
  logIn(user: $user) {
    ...TokenResponseFields
    token
  }
}

mutation SignUp($user: UserInput!) {
  signUp(user: $user) {
    ...TokenResponseFields
    token
  }
}
*/

module.exports = typeDefs
