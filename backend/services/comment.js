module.exports = db => socket => {
  console.log("Socket connected");

  socket.on("room", room => {
    socket.join(room)
    socket.emit('message', `Socket: Hello in ${room}!`);
    socket.to(room).emit('message', `Room: Hello in ${room}!`);
  });
}
