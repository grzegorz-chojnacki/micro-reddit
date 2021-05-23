import axios from 'axios'
import { api } from '@/common'

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const res = await axios.post(`${api}/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });

    console.log(res)
  },
}