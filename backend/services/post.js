const db = require("../config/db");
const fsp = require("fs").promises;
const { limit, newestOrder, md5, imageExt, imageStripMime } = require("../utils");

const getScoreQuery = postId => `
  SELECT sum(vote) FROM post_vote WHERE post_id = ${postId}
`;

const getPostQuery = (postId, userId = null) => `
  SELECT p.id, title, p.subreddit_id AS reddit_id, content,
        image_path AS image, video_url AS video, link,
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
    id, title, reddit_id, content, image, video, link, reddit_name, username,
    user_id, score, voted }) => ({
  id, title, content, image, video, link,
  voted: Number(voted),
  score: Number(score),
  user:   { id: user_id,   username },
  reddit: { id: reddit_id, name: reddit_name }
});

const queryResolver = (query = "") => {
  const match = query.match(/(.*);(title|content|both)?/);

  if (!match) {
    return `title LIKE '%${query}%'`;
  }

  // eslint-disable-next-line no-unused-vars
  const [_, searchStr, searchType = "title"] = match;
  if (searchType === "both") {
    return `(title LIKE '%${searchStr}%' OR content LIKE '%${searchStr}%')`;
  } else {
    return `${searchType} LIKE '%${searchStr}%'`;
  }
};

module.exports = ({
  async get(redditId, postId, userId) {
    const data = (await db.query(`
      ${getPostQuery(postId, userId)}
      WHERE subreddit_id = ${redditId} AND p.id = ${postId}
      ${newestOrder}
    `)).rows[0];

    return postMapper(data);
  },

  async add(redditId, userId, post) {
    const timestamp = new Date().toLocaleString("en-US");
    let imageUrl = "";

    if (post.image) {
      imageUrl = `${md5(post.image)}.${imageExt(post.image)}`;
      await fsp.writeFile(`./storage/${imageUrl}`, imageStripMime(post.image), "base64");
    }

    const postId = (await db.query(`
      INSERT INTO post
        (title, content, image_path, video_url, link, creation_date,
         subreddit_id, user_id)
      VALUES
        ('${post.title}', '${post.content}', '${imageUrl}', '${post.video}',
        '${post.link}', '${timestamp}', ${redditId}, ${userId})
      RETURNING id
    `)).rows[0].id;

    return postId;
  },

  async delete(redditId, postId) {
    await db.query(`
      DELETE FROM post
      WHERE id = ${postId} AND subreddit_id = ${redditId}`
    );
    return true;
  },

  async vote(postId, userId, vote) {
    const voteExists = (await db.query(`
        SELECT vote FROM post_vote
        WHERE post_id = ${postId} AND user_id = ${userId}
      `)).rows[0]?.vote;

    if (voteExists && vote === 0) {
      await db.query(`
        DELETE FROM post_vote
        WHERE post_id = ${postId} AND user_id = ${userId}
      `);
    } else if (voteExists && vote !== 0) {
      await db.query(`
        UPDATE post_vote SET vote = ${vote}
        WHERE post_id = ${postId} AND user_id = ${userId}
      `);
    } else if (!voteExists && vote !== 0) {
      await db.query(`
        INSERT INTO post_vote (vote, post_id, user_id)
        VALUES (${vote}, ${postId}, ${userId})
      `);
    }

    const { score } = (await db.query(`
      SELECT sum(vote) AS score
      FROM post_vote
      WHERE post_id = ${postId}
    `)).rows[0];
    return { score: Number(score) };
  },

  async getAll(redditId, userId, page, query) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      WHERE ${queryResolver(query)} AND subreddit_id = ${redditId}
      ${newestOrder}
      ${limit(page)}
    `);

    return rows.map(postMapper);
  },

  async getMain(userId, page, /* query */) {
    const { rows } = await db.query(`
      ${getPostQuery("p.id", userId)}
      ${newestOrder}
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
      ${newestOrder}
      ${limit(page)}
    `);

    return rows.map(postMapper);
  },
});
