'use strict'

const SQL = require('sequelize')

module.exports = () => {
  const db = new SQL('', '', '', {
    dialect: 'sqlite',
    storage: './db/store.sqlite',
    logging: false,
  })

  const songs = db.define('song', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artist: SQL.STRING,
    name: SQL.STRING,
    reason: SQL.STRING,
    userId: SQL.INTEGER,
  })

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: SQL.STRING,
    password: SQL.STRING,
    salt: SQL.STRING,
  })

  return { songs, users }
}
