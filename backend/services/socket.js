const db = require("../config/db");
const { escapeQuotes } = require("../utils");

const commentMapper = ({ id, content, user_id, username }) => ({
  id, content, user: { username, id: user_id }
});

const isPostMod = async (PostId, userId) => {
  if (!userId) return false;

  const isAuthorized = (await db.query(`
    SELECT * FROM subreddit_moderator AS sm
    INNER JOIN post AS p
      ON p.subreddit_id = sm.subreddit_id
    WHERE p.id = ${PostId} AND sm.user_id = ${userId};
  `)).rows.length === 1;

  return isAuthorized;
};

const isAdmin = async userId => {
  if (!userId) return false;

  const isAuthorized = (await db.query(`
    SELECT * FROM reddit_user AS ru
    LEFT JOIN user_role AS ur
      ON ur.id = ru.id
    LEFT JOIN role AS r ON r.id = role_id
    WHERE ru.id = ${userId} AND role_name = 'administrator'
  `)).rows.length === 1;

  return isAuthorized;
};

module.exports = io => socket => {
  const user = socket.request.user;

  socket.on("reddit", redditId => socket.join(`r/${redditId}`));

  socket.on("post", async postId => {
    socket.join(`p/${postId}`);

    const comments = (await db.query(`
      SELECT c.id, content, user_id, nickname AS username
      FROM comment AS c
      INNER JOIN reddit_user AS ru
        ON user_id = ru.id
      WHERE c.post_id = ${postId}
    `)).rows.map(commentMapper);

    socket.emit("comments", comments.reverse());

    socket.on("comment", async content => {
      if (!user) return;

      const { id } = (await db.query(`
        INSERT INTO comment (content, parent_comment_id, user_id, post_id)
        VALUES ('${escapeQuotes(content)}', NULL, ${user.id}, ${postId})
        RETURNING id
      `)).rows[0];

      io.to(`p/${postId}`).emit("comment", { user, content, id });
    });

    socket.on("deleteComment", async id => {
      if (!isPostMod(postId, user.id)) return;

      await db.query(`DELETE FROM comment WHERE id = ${id}`);
      io.to(`p/${postId}`).emit("deleteComment", id);
    });

    socket.on("banUser", async ({ redditName, postId, userId }) => {
      if (!isAdmin(user.id)) return;

      const redditId = (await db.query(`
        SELECT id FROM subreddit WHERE name = '${redditName}'
      `)).rows[0];

      await db.query(`DELETE FROM comment WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM post_vote WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM post WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM subreddit_user WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM subreddit_moderator WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM user_role WHERE user_id = ${userId}`);
      await db.query(`DELETE FROM reddit_user WHERE id = ${userId}`);

      io.to(`p/${postId}`).emit("banUser", userId);
      io.to(`r/${redditId}`).emit("banUser", userId);
    });
  });
};
