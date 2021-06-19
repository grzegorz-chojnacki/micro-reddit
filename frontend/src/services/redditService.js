import { api, Subject } from "@/common";

let redditSource = Subject();

export const redditService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/r?p=${page}&q=${query}`)).data;
  },

  async add(name, description) {
    return (await api.post("/r", { name, description })).data.name;
  },

  async update(reddit) {
    const { data } = (await api.put(`/r/${reddit.name}`, reddit));
    redditSource.next(data);
    return data;
  },

  async get(redditName) {
    const { data } = await api.get(`/r/${redditName}`);
    redditSource.next(data);
    return data;
  },

  async setSubscribe(redditName, state = false) {
    await api.patch(`/u/r/${redditName}`, { state });

    const reddit = redditSource.value;
    if (reddit && redditName === reddit.name) {
      redditSource.next({ ...reddit, subscribed: state });
    }

    return state;
  },

  async addMod(redditName, username) {
    await api.post(`/r/${redditName}/m/${username}`);
    this.get(redditName);
  },

  get reddit() {
    return redditSource.asObservable();
  },

  async getTopByPosts() {
    return (await api.get("/tr/posts")).data;
  },

  async getTopByUsers() {
    return (await api.get("/tr/users")).data;
  },
};
