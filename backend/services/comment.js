const db = require("../config/db");

const commentMapper = ({ id, content, user_id, username }) => ({
  id, content, user: { username, id: user_id }
});

module.exports = io => socket => {
  const session = socket.request.session;
  const user = socket.request.user;

  socket.on("room", async postId => {
    socket.join(postId);

    const comments = (await db.query(`
      SELECT c.id, content, user_id, nickname AS username
      FROM comment AS c
      INNER JOIN reddit_user AS ru
        ON user_id = ru.id
      WHERE c.post_id = ${postId}
    `)).rows.map(commentMapper);

    socket.emit("comments", comments);

    socket.on("comment", async content => {
      const { id } = (await db.query(`
        INSERT INTO comment (content, parent_comment_id, user_id, post_id)
        VALUES ('${content.replaceAll("'", "''")}', NULL, ${user.id}, ${postId})
        RETURNING id
      `)).rows[0];

      io.to(postId).emit("comment", { user, content, id });
    });

    socket.on("deleteComment", async id => {
      await db.query(`DELETE FROM comment WHERE id = ${id}`);
      io.to(postId).emit("deleteComment", id);
    });
  });

  session.save();
};
