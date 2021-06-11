const db = require("../config/db");

module.exports = ({
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
    }};
  },

  async add(redditId, post) {
    // TODO: pass user id to method
    const userId = 1;
    const timestamp = new Date().toLocaleString("en-US");

    const { rows } = await db.query(`
      INSERT INTO post
        (title, content, image_path, video_url, creation_date, subreddit_id, user_id)
      VALUES
        ('${post.name}', '${post.text}', '${post.image}', '${post.video}', '${timestamp}', ${redditId}, ${userId})
      RETURNING id
    `);
    return rows[0].id;
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
      }};
    });
  },

  async delete(_redditId, postId) {
    await db.query(`DELETE FROM post WHERE id = ${postId}`);
    return true;
  },

  async vote(_redditId, postId, vote) {
    // TODO: pass user id to method
    const userId = 1;
    if (vote === 0) {
      await db.query(`
        DELETE FROM post_vote
        WHERE post_id = ${postId} AND user_id = ${userId}
      `);
    } else {
      await db.query(`
        UPDATE post_vote SET vote = '${vote}'
        WHERE post_id = ${postId} AND user_id = ${userId}
      `);
    }

    const { votes } = db.query(`
      SELECT sum(vote) AS votes
      FROM post_vote
      WHERE post_id = ${postId}
    `);
    return { votes };
  },

  async getMain(page, /* query */) {
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
      }};
    });
  },
});