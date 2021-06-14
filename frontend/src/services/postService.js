import { api } from "@/common";

export const postService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/p?p=${page}&q=${query}`)).data;
  },
  getAllReddit: redditId => async (page = 0, query = "") => {
    return (await api.get(`/r/${redditId}/p?p=${page}&q=${query}`)).data;
  },
  async add(redditId, post) {
    return (await api.post(`/r/${redditId}/p`, post)).data.id;
  },
  async getHome(page = 0, query = "") {
    return (await api.get(`/u/home?p=${page}&q=${query}`)).data;
  },
  async get(redditId, postId) {
    return (await api.get(`/r/${redditId}/p/${postId}`)).data;
  }
};
