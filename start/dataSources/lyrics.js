'use strict'

const { RESTDataSource } = require('apollo-datasource-rest')

class LyricsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.lyrics.ovh/v1/'
  }

  async getLyrics({ artist, name }) {
    try {
      const { lyrics } = await this.get(`${artist}/${name}`)
      return lyrics
    } catch (err) {
      return { error: 'noLyrics' }
    }
  }
}

module.exports = LyricsAPI
