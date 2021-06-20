require("dotenv").config();
const fs = require("fs");
const port = process.env.PORT || 8080;

// Server setup
const express = require("express");
const app = express();
// const nodemailer = require("nodemailer");

const server = require("https").createServer({
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
}, app);

// Express
app.use(require("cors")({
  credentials: true,
  origin: "http://localhost:4200",
  exposedHeaders: ["set-cookie"]
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());

const session = require("./config/session");
app.use(session);

// Passport
const { passport } = require("./config/authentication");

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  const { user } = req;
  req.login(user, () => {});
  res.send(user);
});

app.post("/api/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

// Static files
const path = require("path");
app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
app.use("/api/s", express.static("./storage/"));

// Socket.io
const { socketIoWrap } = require("./utils");
const io = require("socket.io")(server, {
  cors: {
    credentials: true,
    origin: "http://localhost:4200"
  }
}).of("/api");

io.use(socketIoWrap(session));
io.use(socketIoWrap(passport.initialize()));
io.use(socketIoWrap(passport.session()));

const commentService = require("./services/comment")(io);
io.on("connection", commentService);

// Routes
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/reddit"));
app.use("/api", require("./routes/post")(io));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
