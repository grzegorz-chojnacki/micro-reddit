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
      { id: 1, name: "A", score: 100, text: "aaa", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 3, name: "C", score: 200, text: "ccc", voted:  0, reddit: { name: 'Rrrr', id: 1 }},
      { id: 5, name: "E", score: 110, text: "eee", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
    ]);
  },
  setPassword(userId, password) {
    return Promise.resolve(true);
  },
  setSubscribe(userId, redditId, state) {
    return Promise.resolve(true);
  },
});
