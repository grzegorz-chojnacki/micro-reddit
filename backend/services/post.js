const db = require("../config/db");
const { limit } = require("../utils");

const getScoreQuery = postId => `
  SELECT sum(vote) FROM post_vote WHERE post_id = ${postId}
`;

const getPostQuery = (postId, userId = null) => `
  SELECT p.id, title AS name, p.subreddit_id AS reddit_id, content AS text,
        image_path AS image, video_url AS video,
        (${getScoreQuery(postId)}) AS score,
        vote AS voted,
        s.name AS reddit_name, p.subreddit_id AS reddit_id,
        ru.nickname AS username, p.user_id
  FROM post AS p
  INNER JOIN subreddit AS s
    ON p.subreddit_id = s.id
  INNER JOIN reddit_user AS ru
    ON p.user_id = ru.id
  LEFT JOIN post_vote AS pv
    ON p.id = pv.post_id AND pv.user_id = ${userId}
`;

const postMapper = ({
    id, name, reddit_id, text, image, video, reddit_name, username, user_id,
    score, voted }) => ({
  id, name, text, image, video,
  voted: Number(voted),
  score: Number(score),
  user:   { id: user_id,   username },
  reddit: { id: reddit_id, name: reddit_name }
});

module.exports = ({
  async get(redditId, postId, userId) {
    const data = (await db.query(`
      ${getPostQuery(postId, userId)}
      WHERE subreddit_id = ${redditId} AND p.id = ${postId}
    `)).rows[0];

    return postMapper(data);
  },

  async add(redditId, userId, post) {
    const timestamp = new Date().toLocaleString("en-US");

    const { rows } = await db.query(`
      INSERT INTO post
        (title, content, image_path, video_url, creation_date, subreddit_id, user_id)
      VALUES
        ('${post.name}', '${post.text}', '${post.image}', '${post.video}',
         '${timestamp}', ${redditId}, ${userId})
      RETURNING id
    `);
    return rows[0].id;
  },

  async getAll(redditId, userId, page, query) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      WHERE title LIKE '%${query}%' AND subreddit_id = ${redditId}
      ${limit(page)}
    `);

    return rows.map(postMapper);
  },

  async delete(redditId, postId) {
    await db.query(`
      DELETE FROM post
      WHERE id = ${postId} AND subreddit_id = ${redditId}`
    );
    return true;
  },

  async vote(redditId, postId, userId, vote) {
    if (vote === 0) {
      await db.query(`
        DELETE FROM post_vote
        WHERE post_id = ${postId}
          AND subreddit_id = ${redditId}
          AND user_id = ${userId}
      `);
    } else {
      await db.query(`
        UPDATE post_vote SET vote = '${vote}'
        WHERE post_id = ${postId}
          AND subreddit_id = ${redditId}
          AND user_id = ${userId}
      `);
    }

    const { votes } = db.query(`
      SELECT sum(vote) AS votes
      FROM post_vote
      WHERE post_id = ${postId}
    `);
    return { votes };
  },

  async getMain(userId, page, /* query */) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      ${limit(page)}
    `);

    return rows.map(postMapper);
  },

  async getHome(userId, page, /* query */) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      INNER JOIN subreddit_user as su
        ON su.subreddit_id = s.id
      WHERE su.user_id = ${userId}
      ${limit(page)}
    `);

    return rows.map(postMapper);
  },
});
