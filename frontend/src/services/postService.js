import axios from 'axios'
import { api } from '@/common'

export const postService = {
  async getAll() {
    return (await axios.get(`${api}/r`)).data
  }
}
