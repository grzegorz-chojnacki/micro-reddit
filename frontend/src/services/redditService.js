import axios from 'axios'
import { api } from '@/common'

export const redditService = {
  async getAll(page = 0, search = '') {
    return (await axios.get(`${api}/r?p=${page}&q=${search}`)).data
  },
}
