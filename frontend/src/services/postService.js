import axios from 'axios'
import { api } from '@/common'

export const postService = {
  async getAll(page = 0, search = '') {
    return (await axios.get(`${api}/r?p=${page}&q=${search}`)).data
  },
  async getHome(page = 0, search = '') {
    return (await axios.get(`${api}/u/1/home?p=${page}&q=${search}`)).data
  },
  async get(redditId, postId) {
    return (await axios.get(`${api}/r/${redditId}/p/${postId}`)).data
  }
}
