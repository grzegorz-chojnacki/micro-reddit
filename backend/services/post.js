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
    return Promise.resolve(1000);
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

  async getMain(page, order) {
    return Promise.resolve([
      { id: 1, name: "A", score: 100, text: "aaa", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 2, name: "B", score: 120, text: "bbb", voted:  0, reddit: { name: 'Rrrr', id: 2 }},
      { id: 3, name: "C", score: 200, text: "ccc", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 4, name: "D", score: 102, text: "ddd", voted:  0, reddit: { name: 'Rrrr', id: 3 }},
      { id: 5, name: "E", score: 110, text: "eee", voted: -1, reddit: { name: 'Rrrr', id: 2 }},
    ]);
  },
});