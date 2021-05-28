import axios from 'axios'
import { api, Subject } from '@/common'

let isAuthenticated = Subject(false);
let user = Subject({});

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const res = await axios.post(`${api}/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });

    const userId = res.data.id;
    console.log(res);

    if (Number.isInteger(userId)) {
      isAuthenticated.next(true);
      const userData = (await axios.get(`${api}/u/${userId}`)/* , { withCredentials: true } */).data;
      console.log(userData)
      user.next(userData);
    }
  },
  get isAuthenticated() { return isAuthenticated.asObservable(); },
  get user() { return user.asObservable(); },
  logout() { isAuthenticated.next(false); }
}