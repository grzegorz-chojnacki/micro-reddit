import { api, Subject } from "@/common";

let reddit = Subject();

export const redditService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/r?p=${page}&q=${query}`)).data;
  },
  async add(name, text) {
    return (await api.post("/r", { name, text })).data.id;
  },
  async get(redditId) {
    const res = (await api.get(`/r/${redditId}`)).data;
    reddit.next(res);
    return res;
  },
  async addMod(redditId, username) {
    await api.post(`/r/${redditId}/m/${username}`);
    this.get(redditId);
  },
  get reddit() {
    return reddit.asObservable();
  },
};
