module.exports = db => socket => {
  console.log("Socket connected");

  socket.on("room", async postId => {
    socket.join(postId)

    const comments = (await db.query(`
      SELECT c.id, content AS text, user_id, nickname AS username
      FROM comment AS c
      INNER JOIN reddit_user AS ru
        ON user_id = ru.id
      WHERE c.id = ${postId}
    `)).rows.map(({ id, text, user_id, username }) => ({
      id, text, user: { username, id: user_id }
    }))

    socket.emit('comments', comments);
  });
}
