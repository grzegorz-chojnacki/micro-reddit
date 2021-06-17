const db = require("../config/db");

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

    return { id, username, email, admin: role === "administrator" };
  },

  async add(user) {
    const usernameExists = (await db.query(`
      SELECT * FROM reddit_user WHERE nickname = '${user.username}'
    `)).rows.length !== 0;

    if (usernameExists) {
      throw ["username"];
    }

    await db.query(`
      INSERT INTO reddit_user
        (nickname, activation_guid, activation_expire_date, password, email)
      VALUES
        ('${user.username}', NULL, NULL, '${user.password}', '${user.email}')
      RETURNING id
    `);
  },

  async patch(password, changes, userId) {
    const authorized = (await db.query(`
      SELECT * FROM reddit_user
      WHERE id = ${userId} AND password = '${password}'
    `)).rows.length === 1;

    if (!authorized) {
      throw ["password"];
    }

    const handlers = {
      username: async username => {
        const usernameExists = (await db.query(`
          SELECT * FROM reddit_user WHERE nickname = '${username}'
        `)).rows.length !== 0;

        if (usernameExists) throw ["username"];

        await db.query(`
          UPDATE reddit_user
          SET nickname = '${username}'
          WHERE id = ${userId}`
        );
        return { username };
      },
      email: async email => {
        await db.query(`
          UPDATE reddit_user
          SET email = '${email}'
          WHERE id = ${userId}
        `);
        return { email };
      },
      password: async password => {
        await db.query(`
          UPDATE reddit_user
          SET password = '${password}'
          WHERE id = ${userId}
        `);
        return { };
      },
    };

    const updates = Object.keys(changes)
      .map(key => handlers[key](changes[key]));

    return (await Promise.all(updates))
      .reduce((obj, partial) => ({ ...obj, ...partial }));
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
