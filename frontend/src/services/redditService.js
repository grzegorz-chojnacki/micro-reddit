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
    const { data } = (await api.put(`/r/${reddit.id}`, reddit));
    redditSource.next(data);
    return data;
  },
  async get(redditId) {
    const { data } = await api.get(`/r/${redditId}`);
    redditSource.next(data);
    return data;
  },
  async addMod(redditId, username) {
    await api.post(`/r/${redditId}/m/${username}`);
    this.get(redditId);
  },
  get reddit() {
    return redditSource.asObservable();
  },
};
