'use strict'

const { DataSource } = require('apollo-datasource')

const { createSaltAndHash } = require('../lib/hash')

const formatUser = ({ dataValues: { email, id } }) => ({ email, id })

class UserAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  async findById({ id }) {
    const user = await this.store.users.findOne({ where: { id } })
    return user ? formatUser(user) : { error: 'noUser' }
  }

  async signUp({ email, password }) {
    if (!email || !password) return { error: 'incompleteData' }
    const user = await this.store.users.findOne({ where: { email } })
    if (user) return { error: 'alreadyExists' }
    const { salt, hash } = await createSaltAndHash(password)
    const newUser = await this.store.users.create({ email, password: hash, salt })
    return formatUser(newUser)
  }
}

module.exports = UserAPI
