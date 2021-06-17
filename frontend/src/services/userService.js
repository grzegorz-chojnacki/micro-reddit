import { api, Subject } from "@/common";

let userSource = Subject({});
let isAuthenticatedSource = Subject(false);

api
  .get("/u")
  .then(({ data }) => {
    userSource.next(data);
    isAuthenticatedSource.next(true);
  })
  .catch(() => {});

export const userService = {
  async login(username, password) {
    const user = (await api.post("/login", { username, password })).data;

    isAuthenticatedSource.next(true);
    userSource.next(user);
  },

  async register(username, password, email) {
    const { errors } = (await api.post("/u", { username, password, email })).data;
    return errors || this.login(username, password);
  },

  async patch(password, changes = {}) {
    const { errors, user } = (await api.patch("/u", { changes, password })).data;

    if (errors) {
      return errors;
    } else {
      userSource.next(user);
      return user;
    }
  },

  get isAuthenticated() {
    return isAuthenticatedSource.asObservable();
  },

  get user() {
    return userSource.asObservable();
  },

  async logout() {
    await api.post("/logout");
    isAuthenticatedSource.next(false);
    userSource.next({});
  },
};
