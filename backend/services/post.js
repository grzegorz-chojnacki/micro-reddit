const db = require("../config/db");

const getScoreQuery = postId => `(
  SELECT count(*) FROM post_vote WHERE post_id = ${postId}
)`;

const getVotedQuery = (postId, userId) => `(
  SELECT max(CASE WHEN user_id = ${userId} THEN 1 ELSE 0 END)
  FROM post_vote
  WHERE post_id = ${postId}
)`;

const getPostQuery = (postId, userId = null) => `
SELECT p.id, title AS name, content AS text, image_path AS image, video_url AS video,
       ${getScoreQuery(postId)} AS score,
       ${getVotedQuery(postId, userId)} AS voted,
       s.name AS reddit_name, subreddit_id AS reddit_id,
       ru.nickname AS username, p.user_id
FROM post AS p
INNER JOIN subreddit AS s
  ON p.subreddit_id = s.id
INNER JOIN reddit_user AS ru
  ON p.user_id = ru.id
`;

module.exports = ({
  async get(redditId, postId, userId) {
    const data = (await db.query(`
      ${getPostQuery(postId, userId)}
      WHERE subreddit_id = ${redditId} AND p.id = ${postId}
    `)).rows[0];

    console.log(data);

    const { id, name, text, image, video, reddit_name, username, user_id, score, voted }
      = data;

    return {
      id, name, text, image, video, score, voted,
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

  async getAll(redditId, userId, page, query) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      WHERE title LIKE '%${query}%' AND subreddit_id = ${redditId}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(
      ({ id, name, text, image, video, reddit_name, username, user_id, score, voted }) => ({
        id, name, text, image, video, score, voted,
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
      ${getPostQuery("p.id")}
      LIMIT 10 OFFSET ${page * 10}
    `);

    return rows.map(
      ({ id, name, text, image, video, reddit_name, reddit_id, username, user_id, score, voted }) => ({
        id, name, text, image, video, score, voted,
        user: { username, id: user_id },
        reddit: {
          id: reddit_id,
          name: reddit_name
        }
      })
    );
  },
});