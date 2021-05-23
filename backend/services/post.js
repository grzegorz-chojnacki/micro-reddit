module.exports = db => ({
  async get(redditId, postId) {
    const { id, name, text, image, video, reddit_name } = (await db.query(`
      SELECT p.id, title AS name, content AS text, image_path AS image,
             video_url AS video, s.name AS reddit_name
      FROM post AS p
      INNER JOIN subreddit AS s
      ON s.id = subreddit_id
      WHERE subreddit_id = ${redditId} AND p.id = ${postId}
    `)).rows[0];

    return { id, name, text, image, video, reddit: {
      id: redditId,
      name: reddit_name
    }}
  },

  async add(redditId, post) {
    // TODO: pass user id to method

    const { rows } = await db.query(`
      INSERT INTO post
        (title, content, image_path, video_url, creation_date, subreddit_id, user_id)
      VALUES
        ('${post.name}', '${post.text}', '${post.image}', '${post.video}', '${post.created}', ${redditId}, 1)
      RETURNING id
    `);

    return rows[0].id
  },

  async update(redditId, postId, post) {
    const oldPost = { id: 12, name: "X", text: "xxx" };
    return Promise.resolve({ ...oldPost, ...post });
  },

  async getAll(redditId, page, query) {
    const { rows } = await db.query(`
      SELECT p.id, title AS name, content AS text, image_path AS image,
             video_url AS video, s.name AS reddit_name
      FROM post AS p
      INNER JOIN subreddit AS s
        ON s.id = subreddit_id
      WHERE title LIKE '%${query}%' AND subreddit_id = ${redditId}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(({ id, name, text, image, video, reddit_name }) => {
      return { id, name, text, image, video, reddit: {
        id: redditId,
        name: reddit_name
      }}
    })
  },

  async delete(redditId, postId) {
    return Promise.resolve(true);
  },

  async vote(redditId, postId, vote) {
    return Promise.resolve(100 + vote);
  },

  async getMain(page, query) {
    const { rows } = await db.query(`
      SELECT p.id, title AS name, content AS text, image_path AS image,
             video_url AS video, s.name AS reddit_name, s.id as reddit_id
      FROM post AS p
      INNER JOIN subreddit AS s
        ON s.id = subreddit_id
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(({ id, name, text, image, video, reddit_name, reddit_id }) => {
      return { id, name, text, image, video, reddit: {
        id: reddit_id,
        name: reddit_name
      }}
    })
  },
});