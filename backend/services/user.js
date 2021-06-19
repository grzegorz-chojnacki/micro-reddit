const db = require("../config/db");
const { escapeQuotes } = require("../utils");

module.exports = ({
  async get(userId) {
    const { id, username, email, role } = (await db.query(`
      SELECT ru.id, nickname AS username, email, role_name AS role
      FROM reddit_user AS ru
      LEFT JOIN user_role AS ur
        ON ur.id = ru.id
      LEFT JOIN role AS r ON r.id = role_id
      WHERE ru.id = ${userId}
    `)).rows[0];

    const modding = (await db.query(`
      SELECT s.id, s.name
      FROM subreddit AS s
      INNER JOIN subreddit_moderator AS sm
        ON s.id = sm.subreddit_id
      WHERE sm.user_id = ${userId}
    `)).rows;

    return { id, username, email, modding, admin: role === "administrator" };
  },

  async add(user) {
    const usernameExists = (await db.query(`
      SELECT * FROM reddit_user WHERE nickname = '${user.username}'
    `)).rows.length !== 0;

    if (usernameExists) throw new Error("username");

    await db.query(`
      INSERT INTO reddit_user
        (nickname, activation_guid, activation_expire_date, password, email)
      VALUES
        ('${escapeQuotes(user.username)}', NULL, NULL,
         '${escapeQuotes(user.password)}', '${escapeQuotes(user.email)}')
      RETURNING id
    `);
  },

  async patch(password, changes, userId) {
    const authorized = (await db.query(`
      SELECT * FROM reddit_user
      WHERE id = ${userId} AND password = '${escapeQuotes(password)}'
    `)).rows.length !== 0;

    if (!authorized) throw new Error("password");

    const handlers = {
      username: async username => {
        const usernameExists = (await db.query(`
          SELECT * FROM reddit_user WHERE nickname = '${username}'
        `)).rows.length !== 0;

        if (usernameExists) throw new Error("username");

        await db.query(`
          UPDATE reddit_user
          SET nickname = '${escapeQuotes(username)}'
          WHERE id = ${userId}`
        );
        return { username };
      },
      email: async email => {
        await db.query(`
          UPDATE reddit_user
          SET email = '${escapeQuotes(email)}'
          WHERE id = ${userId}
        `);
        return { email };
      },
      password: async password => {
        await db.query(`
          UPDATE reddit_user
          SET password = '${escapeQuotes(password)}'
          WHERE id = ${userId}
        `);
        return { };
      },
    };

    const updates = Object.keys(changes)
      .map(key => handlers[key](changes[key]));

    return (await Promise.all(updates))
      .reduce((obj, partial) => ({ ...obj, ...partial }), {});
  },

  async delete(userId) {
    await db.query(`DELETE FROM reddit_user WHERE id = ${userId}`);
    return true;
  },

  async setPassword(/* userId, password */) {
    return Promise.resolve(true);
  },

  async setSubscribe(redditId, userId, subscribing = false) {
    const unsubscribing = !subscribing;
    const subscriptionExists = (await db.query(`
      SELECT * FROM subreddit_user
      WHERE subreddit_id = ${redditId} AND user_id = ${userId}
    `)).rows.length > 0;

    if (!subscriptionExists && subscribing) {
      await db.query(`
        INSERT INTO subreddit_user (user_id, subreddit_id)
        VALUES (${userId}, ${redditId})
      `);
    } else if (subscriptionExists && unsubscribing) {
      await db.query(`
        DELETE FROM subreddit_user
        WHERE subreddit_id = ${redditId} AND user_id = ${userId}
      `);
    }

    return true;
  },
});
