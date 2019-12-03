'use strict'

const sqlite3 = require('sqlite3')

// Path is relative to location script is run from
const db = new sqlite3.Database('./db/store.sqlite')

db.serialize(() => {
  db.run(`
    CREATE TABLE songs (
      id INTEGER PRIMARY KEY,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      artist TEXT NOT NULL,
      name TEXT NOT NULL,
      reason TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `)
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
    );
  `)
})

db.close()
