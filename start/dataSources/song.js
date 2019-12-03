'use strict'

const { DataSource } = require('apollo-datasource')

const formatSong = ({ dataValues: { createdAt, artist, name, reason, id, userId } }) => ({
  createdAt,
  artist,
  name,
  reason,
  id,
  userId,
})

class SongAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  async findByUserId({ userId }) {
    const songs = await this.store.songs.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }
}

module.exports = SongAPI
