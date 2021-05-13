require("dotenv").config();
const port = process.env.PORT || 8080

// Database setup
const db = new (require("pg").Client)({
  host:     process.env.PGHOST || "127.0.0.1",
  port:     process.env.PGPORT || 5432,
  database: process.env.PGDB,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
});
// db.connect();

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
    app.use(require("cors")());
    return require("http").createServer(app)
  }
}

const server = setupServer("development")

// Express
app.use(express.json());
app.use(require("cookie-parser")());
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport
const passport = require("passport");
const passportLocal = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());

const validateUser = (username, password, done) => {
  done(null, { id: 1 });
};

passport.use(new passportLocal.Strategy(validateUser));

passport.deserializeUser((id, done) => {
  let user = {
      id,
      username: "tomek",
      password: "tajne"
  }
  done(null, {
      id: user.id,
      username: user.username,
      password: user.password
  });
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Routes & services
const redditService  = require("./services/reddit")(db);
const userService    = require("./services/user")(db);

app.use("/api/r", require("./routes/reddit")(redditService));
app.use("/api/u", require("./routes/user")(userService));

const path = require("path")
app.use("/", express.static(path.join(__dirname, "../frontend/dist")))

// Socket.io
const io = require("socket.io")(server, { cors: {}})
const commentService = require("./services/comment")(db);

io.of('/api').on("connection", commentService)

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
