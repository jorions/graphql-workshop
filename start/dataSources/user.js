'use strict'

const { DataSource } = require('apollo-datasource')

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
}

module.exports = UserAPI
