import axios from 'axios'
import { api } from '@/common'

export const redditService = {
  async getAll(page = 0, query = '') {
    return (await axios.get(`${api}/r?p=${page}&q=${query}`)).data
  },
}
