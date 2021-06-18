const db = require("../config/db");

const commentMapper = ({ id, content, user_id, username }) => ({
  id, content, user: { username, id: user_id }
});

module.exports = socket => {
  const session = socket.request.session;
  const user = socket.request.user;
  console.log(session, user);

  socket.on("room", async postId => {

    socket.join(postId);

    const comments = (await db.query(`
      SELECT c.id, content, user_id, nickname AS username
      FROM comment AS c
      INNER JOIN reddit_user AS ru
        ON user_id = ru.id
      WHERE c.id = ${postId}
    `)).rows.map(commentMapper);

    socket.emit("comments", comments);
  });

  session.save();

  socket.on("comment", async comment => {
    console.log(comment);
  });
};
