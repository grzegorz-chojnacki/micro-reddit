import { api, Subject } from '@/common'

let isAuthenticatedSource = Subject(false);
let userSource = Subject({});

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const { user } = (await api.post(`/login`, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).data;

    if (user) {
      const userData = (await api.get(`/u`)).data;
      isAuthenticatedSource.next(true);
      userSource.next(userData);
    }
  },
  get isAuthenticated() { return isAuthenticatedSource.asObservable(); },
  get user() { return userSource.asObservable(); },
  async logout() {
    await api.post(`/logout`);
    isAuthenticatedSource.next(false);
    userSource.next(null);
  }
}
