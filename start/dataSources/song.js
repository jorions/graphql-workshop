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

  initialize(config) {
    this.context = config.context
  }

  async findByUserId({ userId }) {
    const songs = await this.store.songs.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }

  async recentFavorites() {
    const songs = await this.store.songs.findAll({ limit: 20, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }

  async addFavorite({ artist, name, reason }) {
    if (!artist || !name || !reason) return { error: 'incompleteData' }
    const { userId } = this.context
    const song = await this.store.songs.create({ artist, name, reason, userId })
    return formatSong(song)
  }
}

module.exports = SongAPI
