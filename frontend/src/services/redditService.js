import { api } from "@/common";

export const redditService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/r?p=${page}&q=${query}`)).data;
  },
  async add(name, text) {
    return (await api.post("/r", { name, text })).data.id;
  },
};
