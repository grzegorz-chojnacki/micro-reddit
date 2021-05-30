import { api, Subject } from '@/common'

let isAuthenticatedSource = Subject(false);
let userSource = Subject({});

const options = {
  headers: {'Content-Type': 'application/x-www-form-urlencoded' }
};

export const loginService = {
  async login(username, password) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const user = (await api.post(`/login`, data, options)).data;

    isAuthenticatedSource.next(true);
    userSource.next(user);
  },
  async register(username, password, email) {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);
    data.append('email', email);

    await api.post(`/u`, data, options);
    this.login(username, password);
  },
  get isAuthenticated() { return isAuthenticatedSource.asObservable(); },
  get user() { return userSource.asObservable(); },
  async logout() {
    await api.post(`/logout`);
    isAuthenticatedSource.next(false);
    userSource.next(null);
  }
}
