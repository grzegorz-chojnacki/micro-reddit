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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require("./config/session"));

// Passport
const { passport } = require("./config/authentication");

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  const { user } = req;
  req.login(user, err => err && console.error(err));
  res.send(user);
});

app.post("/api/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

// Routes & services
const path = require("path");
app.use("/", express.static(path.join(__dirname, "../frontend/dist")));

const userService   = require("./services/user");
const redditService = require("./services/reddit");
const postService   = require("./services/post");

app.use("/api", require("./routes/user")(userService));
app.use("/api", require("./routes/reddit")(redditService));
app.use("/api", require("./routes/post")(postService));

// Socket.io
const io = require("socket.io")(server, { cors: {}});
const commentService = require("./services/comment");

io.of("/api").on("connection", commentService);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
