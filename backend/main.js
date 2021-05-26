require("dotenv").config();
const port = process.env.PORT || 8080;

// Server setup
const express = require("express");
const app = express();
// const nodemailer = require("nodemailer");

const setupServer = mode => {
  const fs = require("fs");
  if (mode === "production") {
    return require("https").createServer({
      key: fs.readFileSync("./ssl/key.pem"),
      cert: fs.readFileSync("./ssl/cert.pem"),
    }, app);
  } else {
    app.use(require("cors")({
      credentials: true,
      origin: "http://localhost:4200"
    }));
    return require("http").createServer(app);
  }
};

const server = setupServer("development");

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport
const passport = require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.send("logged");
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
