import axios from 'axios'
import { api, Subject } from '@/common'

let isAuthenticatedSource = Subject(false);
let userSource = Subject({});

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const { user } = (await axios.post(`${api}/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    })).data;

    if (user) {
      const userData = (await axios.get(`${api}/u/${user.id}`, { withCredentials: true })).data;
      isAuthenticatedSource.next(true);
      userSource.next(userData);
    }
  },
  get isAuthenticated() { return isAuthenticatedSource.asObservable(); },
  get user() { return userSource.asObservable(); },
  async logout() {
    await axios.post(`${api}/logout`, { withCredentials: true });
    isAuthenticatedSource.next(false);
    userSource.next(null);
  }
}
