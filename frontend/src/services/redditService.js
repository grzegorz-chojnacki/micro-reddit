import { api, Subject } from "@/common";

let redditSource = Subject();

export const redditService = {
  async getAll(page = 0, query = "") {
    return (await api.get(`/r?p=${page}&q=${query}`)).data;
  },
  async add(name, text) {
    return (await api.post("/r", { name, text })).data.id;
  },
  async update(reddit) {
    return await api.put(`/r/${reddit.id}`, reddit);
  },
  async get(redditId) {
    const res = (await api.get(`/r/${redditId}`)).data;
    redditSource.next(res);
    return res;
  },
  async addMod(redditId, username) {
    await api.post(`/r/${redditId}/m/${username}`);
    this.get(redditId);
  },
  get reddit() {
    return redditSource.asObservable();
  },
};
