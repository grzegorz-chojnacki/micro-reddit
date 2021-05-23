module.exports = db => ({
  async get(userId) {
    const { id, username, role } = (await db.query(`
      SELECT ru.id, nickname AS username, role_name AS role
      FROM reddit_user AS ru
      INNER JOIN user_role AS ur
        ON ur.id = ru.id
      INNER JOIN role AS r ON r.id = role_id
      WHERE ru.id = ${userId}
    `)).rows[0];

    return { id, username, admin: role == 'administrator' }
  },

  async add(user) {
    return Promise.resolve(1337);
  },

  async update(user) {
    return Promise.resolve({ ...user, username: 'New' });
  },

  async delete(userId) {
    return Promise.resolve(true);
  },

  async getHome(userId, page, order) {
    return Promise.resolve([
      { id: 1, name: "A", score: 100, text: "aaa", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 3, name: "C", score: 200, text: "ccc", voted:  0, reddit: { name: 'Rrrr', id: 1 }},
      { id: 5, name: "E", score: 110, text: "eee", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
    ]);
  },

  async setPassword(userId, password) {
    return Promise.resolve(true);
  },

  async setSubscribe(userId, redditId, state) {
    return Promise.resolve(true);
  },
});
