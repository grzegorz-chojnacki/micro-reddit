const db = require("../config/db");

const getPostQuery = `
SELECT p.id, title AS name, content AS text, image_path AS image, video_url AS video,
       s.name AS reddit_name, subreddit_id AS reddit_id,
       ru.nickname AS username, p.user_id
FROM post AS p
INNER JOIN subreddit AS s
  ON s.id = subreddit_id
INNER JOIN reddit_user AS ru
  ON ru.id = p.user_id
`;

module.exports = ({
  async get(redditId, postId) {
    const data = (await db.query(`
      ${getPostQuery}
      WHERE subreddit_id = ${redditId} AND p.id = ${postId}
    `)).rows[0];

    const { id, name, text, image, video, reddit_name, username, user_id }
      = data;

    return {
      id, name, text, image, video,
      user: { username, id: user_id },
      reddit: {
        id: redditId,
        name: reddit_name
      }
    };
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

  async getAll(redditId, page, query) {
    const { rows } = await db.query(`
     ${getPostQuery}
      WHERE title LIKE '%${query}%' AND subreddit_id = ${redditId}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(
      ({ id, name, text, image, video, reddit_name, username, user_id }) => ({
        id, name, text, image, video,
        user: { username, id: user_id },
        reddit: {
          id: redditId,
          name: reddit_name
        }
      })
    );
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

  async getMain(page, /* query */) {
    const { rows } = await db.query(`
      ${getPostQuery}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(
      ({ id, name, text, image, video, reddit_name, reddit_id, username, user_id }) => ({
        id, name, text, image, video,
        user: { username, id: user_id },
        reddit: {
          id: reddit_id,
          name: reddit_name
        }
      })
    );
  },
});