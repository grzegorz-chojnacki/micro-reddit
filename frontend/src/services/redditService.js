import { api } from "@/common";

export const redditService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/r?p=${page}&q=${query}`)).data;
  },

  async add(name, description) {
    return (await api.post("/r", { name, description })).data;
  },

  async update(reddit) {
    return (await api.put(`/r/${reddit.name}`, reddit)).data;
  },

  async get(redditName) {
    return (await api.get(`/r/${redditName}`)).data;
  },

  async setSubscribe(redditName, state = false) {
    await api.patch(`/u/r/${redditName}`, { state });
    return state;
  },

  async addMod(redditName, username) {
    return (await api.post(`/r/${redditName}/m/${username}`)).data;
  },

  async getTopByPosts() {
    return (await api.get("/tr/posts")).data;
  },

  async getTopByUsers() {
    return (await api.get("/tr/users")).data;
  },
};
