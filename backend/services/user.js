const db = require("../config/db");

module.exports = ({
  async get(userId) {
    const { id, username, role } = (await db.query(`
      SELECT ru.id, nickname AS username, role_name AS role
      FROM reddit_user AS ru
      LEFT JOIN user_role AS ur
        ON ur.id = ru.id
      LEFT JOIN role AS r ON r.id = role_id
      WHERE ru.id = ${userId}
    `)).rows[0];

    return { id, username, admin: role === "administrator" };
  },

  async add(user) {
    const usernameExists = (await db.query(`
      SELECT * FROM reddit_user WHERE nickname = '${user.username}'
    `)).rows[0];

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

  async update(user) {
    const rows = await db.query(`
      UPDATE reddit_user SET
        nickname = '${user.username}',
        password = '${user.password}',
        email = '${user.email}'
      WHERE id = ${user.id}
      RETURNING id, nickname AS username, email
    `);
    return rows[0];
  },

  async delete(userId) {
    await db.query(`DELETE FROM reddit_user WHERE id = ${userId}`);
    return true;
  },

  async getHome(userId, page, /* order */) {
    const { rows } = await db.query(`
      SELECT p.id, title AS name, content AS text, image_path AS image,
             video_url AS video, s.name AS reddit_name, s.id as reddit_id
      FROM post AS p
      INNER JOIN subreddit AS s
        ON s.id = subreddit_id
      INNER JOIN subreddit_user as su
        ON su.id = s.id
      WHERE su.user_id = ${userId}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(({ id, name, text, image, video, reddit_name, reddit_id }) => {
      return { id, name, text, image, video, reddit: {
        id: reddit_id,
        name: reddit_name
      }};
    });
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
      console.log("subscribed!");
    } else if (subscriptionExists && unsubscribing) {
      await db.query(`
        DELETE FROM subreddit_user
        WHERE subreddit_id = ${redditId} AND user_id = ${userId}
      `);
      console.log("unsubscribed!");
    }

    return true;
  },
});
