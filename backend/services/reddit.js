const db = require("../config/db");

module.exports = ({
  async get(redditId) {
    const { id, name, text } = (await db.query(`
      SELECT id, name, description AS text
      FROM subreddit WHERE id = ${redditId}
    `)).rows[0];

    const mods = (await db.query(`
      SELECT ru.id, ru.nickname AS name
      FROM subreddit_moderator AS sm
      INNER JOIN reddit_user AS ru
      ON sm.user_id = ru.id
      WHERE subreddit_id = ${redditId}
    `)).rows;

    return { id, name, text, mods };
  },

  async add(reddit, userId) {
    const { rows } = await db.query(`
      INSERT INTO subreddit (name, description)
      VALUES ('${reddit.name}', '${reddit.text}')
      RETURNING id
    `);

    await db.query(`
      INSERT INTO subreddit_moderator (user_id, subreddit_id)
      VALUES ('${userId}', '${rows[0].id}')
    `);

    return rows[0].id;
  },

  async update(reddit) {
    await db.query(`
      UPDATE subreddit SET
        description = '${reddit.text}'
      WHERE id = ${reddit.id}
      RETURNING id, name, description AS text
    `);
    return reddit;
  },

  async addMod(redditId, username) {
    const userId = (await db.query(`
      SELECT id FROM reddit_user
      WHERE nickname = '${username}'
    `)).rows[0].id;

    return await db.query(`
      INSERT INTO subreddit_moderator (subreddit_id, user_id)
      SELECT ${redditId}, ${userId}
      WHERE NOT EXISTS (
        SELECT * FROM subreddit_moderator AS sm
        WHERE sm.user_id = ${userId} AND sm.subreddit_id = ${redditId})
    `);
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
