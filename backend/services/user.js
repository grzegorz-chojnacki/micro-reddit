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
      }}
    })
  },

  async setPassword(userId, password) {
    return Promise.resolve(true);
  },

  async setSubscribe(userId, redditId, state) {
    return Promise.resolve(true);
  },
});
