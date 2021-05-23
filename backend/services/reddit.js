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
    const { rows } = await db.query(`
      INSERT INTO subreddit (name, description)
      VALUES ('${reddit.name}', '${reddit.text}')
      RETURNING id
    `);

    // TODO: pass user id to method

    // await db.query(`
    //   INSERT INTO subreddit_moderator (user_id, subreddit_id)
    //   VALUES ('${userId}', '${rows[0].id}')
    // `);

    return rows[0].id
  },

  async update(reddit) {
    const oldReddit = { id: 12, name: "X", text: "xxx" };
    return Promise.resolve({ ...oldReddit, ...reddit });
  },

  async getAll(page, query) {
      return (await db.query(`
        SELECT id, name, description AS text
        FROM subreddit
        WHERE name LIKE '%${query}%'
        LIMIT 10 OFFSET ${page * 10}
      `)).rows;
  },
});
