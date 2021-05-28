import axios from 'axios'
import { api, Subject } from '@/common'

let isAuthenticated = Subject(false);

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const res = await axios.post(`${api}/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });

    isAuthenticated.next(res.data === "logged");
  },
  get isAuthenticated() { return isAuthenticated.asObservable(); },
  logout() { isAuthenticated.next(false); }
}