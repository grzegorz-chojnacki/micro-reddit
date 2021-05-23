import axios from 'axios'
import { api } from '@/common'

export const postService = {
  async getAll(page = 0, query = '') {
    return (await axios.get(`${api}/p?p=${page}&q=${query}`)).data
  },
  getAllReddit: redditId => async (page = 0, query = '') => {
    return (await axios.get(`${api}/r/${redditId}/p?p=${page}&q=${query}`)).data
  },
  async getHome(page = 0, query = '') {
    return (await axios.get(`${api}/u/1/home?p=${page}&q=${query}`)).data
  },
  async get(redditId, postId) {
    return (await axios.get(`${api}/r/${redditId}/p/${postId}`)).data
  }
}
