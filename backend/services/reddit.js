const db = require("../config/db");
const { limit } = require("../utils");

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
    const { id, name, description, subscribed } = (await db.query(`
      SELECT id, name, description,
             ${isSubscribed(redditId, userId)} AS subscribed
      FROM subreddit
      WHERE id = ${redditId}
    `)).rows[0];

    const mods = (await db.query(`
      SELECT ru.id, ru.nickname AS username
      FROM subreddit_moderator AS sm
      INNER JOIN reddit_user AS ru
      ON sm.user_id = ru.id
      WHERE subreddit_id = ${redditId}
    `)).rows;

    return subscribedBooleanCast({ id, name, description, mods, subscribed });
  },

  async add(reddit, userId) {
    const redditId = (await db.query(`
      INSERT INTO subreddit (name, description)
      SELECT '${reddit.name}', '${reddit.description}'
      WHERE NOT EXISTS (SELECT * FROM subreddit WHERE name = '${reddit.name}')
      RETURNING id
    `)).rows[0].id;

    await db.query(`
      INSERT INTO subreddit_moderator (user_id, subreddit_id)
      VALUES (${userId}, ${redditId})
    `);

    await db.query(`
      INSERT INTO subreddit_user (user_id, subreddit_id)
      VALUES (${userId}, ${redditId})
    `);

    return reddit.name;
  },

  async update(reddit) {
    await db.query(`
      UPDATE subreddit SET
        description = '${reddit.description}'
      WHERE id = ${reddit.id}
      RETURNING id, name, description
    `);
    return reddit;
  },

  async addMod(redditId, username) {
    const modId = (await db.query(`
      SELECT id FROM reddit_user
      WHERE nickname = '${username}'
    `)).rows[0].id;

    return await db.query(`
      INSERT INTO subreddit_moderator (subreddit_id, user_id)
      SELECT ${redditId}, ${modId}
      WHERE NOT EXISTS (
        SELECT * FROM subreddit_moderator AS sm
        WHERE sm.user_id = ${modId} AND sm.subreddit_id = ${redditId})
    `);
  },

  async getAll(userId, page, query) {
    return (await db.query(`
      SELECT id, name, description,
             ${isSubscribed("subreddit.id", userId)} AS subscribed
      FROM subreddit
      WHERE name LIKE '%${query}%'
      ${limit(page)}
    `)).rows.map(subscribedBooleanCast);
  },
});
