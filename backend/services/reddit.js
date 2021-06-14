const db = require("../config/db");

const isSubscribed = (redditId, userId = null) => `
CASE WHEN EXISTS (
  SELECT *
  FROM subreddit_user AS su
  WHERE su.subreddit_id = ${redditId} AND su.user_id = ${userId}
) THEN 1 ELSE 0 END
`;

const subscribedBooleanCast = reddit =>
  ({ ...reddit, subscribed: !!reddit.subscribed });

module.exports = ({
  async get(redditId, userId = null) {
    const { id, name, text, subscribed } = (await db.query(`
      SELECT id, name, description AS text,
             ${isSubscribed(redditId, userId)} AS subscribed
      FROM subreddit
      WHERE id = ${redditId}
    `)).rows[0];

    const mods = (await db.query(`
      SELECT ru.id, ru.nickname AS name
      FROM subreddit_moderator AS sm
      INNER JOIN reddit_user AS ru
      ON sm.user_id = ru.id
      WHERE subreddit_id = ${redditId}
    `)).rows;

    return subscribedBooleanCast({ id, name, text, mods, subscribed });
  },

  async add(reddit, userId) {
    const redditId = (await db.query(`
      INSERT INTO subreddit (name, description)
      VALUES ('${reddit.name}', '${reddit.text}')
      RETURNING id
    `)).rows[0].id;

    await db.query(`
      INSERT INTO subreddit_moderator (user_id, subreddit_id)
      VALUES ('${userId}', '${redditId}')
    `);

    await db.query(`
      INSERT INTO subreddit_user (user_id, subreddit_id)
      VALUES ('${userId}', '${redditId}')
    `);

    return redditId;
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

  async getAll(userId, page, query) {
    return (await db.query(`
      SELECT id, name, description AS text,
             ${isSubscribed("subreddit.id", userId)} AS subscribed
      FROM subreddit
      WHERE name LIKE '%${query}%'
      LIMIT 10 OFFSET ${page * 10}
    `)).rows.map(subscribedBooleanCast);
  },
});
