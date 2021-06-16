import { api } from "@/common";

export const postService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/p?p=${page}&q=${query}`)).data;
  },
  getAllReddit: redditName => async (page = 0, query = "") => {
    return (await api.get(`/r/${redditName}/p?p=${page}&q=${query}`)).data;
  },
  async add(redditName, post) {
    return (await api.post(`/r/${redditName}/p`, post)).data.id;
  },
  async getHome(page = 0, query = "") {
    return (await api.get(`/u/home?p=${page}&q=${query}`)).data;
  },
  async get(redditName, postId) {
    return (await api.get(`/r/${redditName}/p/${postId}`)).data;
  },
  async vote(redditName, postId, vote) {
    return (await api.patch(`/r/${redditName}/p/${postId}`, { vote })).data;
  }
};
