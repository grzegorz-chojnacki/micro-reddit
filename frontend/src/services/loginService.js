import axios from 'axios'
import { api, Subject } from '@/common'

let isAuthenticatedSource = Subject(false);
let userSource = Subject({});

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const res = await axios.post(`${api}/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });

    const { user, sessionID } = res.data;

    console.log(user, sessionID);

    if (user && sessionID) {
      localStorage.setItem("sessionID", sessionID);
      const userData = (await axios.get(`${api}/u/${user.id}`), { withCredentials: true }).data;
      console.log(userData)
      isAuthenticatedSource.next(true);
      userSource.next(user);
    }
  },
  get isAuthenticated() { return isAuthenticatedSource.asObservable(); },
  get user() { return userSource.asObservable(); },
  logout() {
    localStorage.removeItem("sessionID");
    isAuthenticatedSource.next(false);
    userSource.next(null);
  }
}
