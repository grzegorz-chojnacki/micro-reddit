module.exports = db => ({
  async get(redditId) {
    const { id, name, text } = (await db.query(`
      SELECT id, name, description AS text
      FROM subreddit WHERE id = ${redditId}
    `)).rows[0];

    const mods = (await db.query(`
      SELECT ru.id, ru.nickname
      FROM subreddit_moderator AS sm
      INNER JOIN reddit_user AS ru
      ON sm.user_id = ru.id
      WHERE subreddit_id = ${redditId}
    `)).rows;

    return { id, name, text, mods }
  },

  async add(reddit) {
    return Promise.resolve(1000);
  },
  async update(reddit) {
    const oldReddit = { id: 12, name: "X", text: "xxx" };
    return Promise.resolve({ ...oldReddit, ...reddit });
  },
  async getAll(page, order) {
    return Promise.resolve([
      { id: 1, name: "A", text: "aaa" },
      { id: 2, name: "B", text: "bbb" },
      { id: 3, name: "C", text: "ccc" },
      { id: 4, name: "D", text: "ddd" },
      { id: 5, name: "E", text: "eee" },
    ]);
  }
});
