module.exports = db => ({
  get(userId) {
    return Promise.resolve({ id: 1, admin: true, username: 'root' });
  },
  add(user) {
    return Promise.resolve(1337);
  },
  update(user) {
    return Promise.resolve({ ...user, username: 'New' });
  },
  delete(userId) {
    return Promise.resolve(true);
  },
  getHome(userId, page, order) {
    return Promise.resolve([
      { id: 1, name: "A", text: "aaa" },
      { id: 3, name: "C", text: "ccc" },
      { id: 5, name: "E", text: "eee" },
    ]);
  },
  setPassword(userId, password) {
    return Promise.resolve(true);
  },
  setSubscribe(userId, redditId, state) {
    return Promise.resolve(true);
  },
});
