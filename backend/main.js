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
db.connect();

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
      origin: 'http://localhost:4200'
    }));
    return require("http").createServer(app)
  }
}

const server = setupServer("development")

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
const passport = require("passport");
const passportLocal = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(async (username, password, done) => {
  try {
    const { rows } = await db.query(`
      SELECT id FROM reddit_user
      WHERE nickname = '${username}' AND password = '${password}'
    `);
    done(null, { id: rows[0].id });
    //  return done(null, false, { message: 'Incorrect credentials.' });
  } catch (err) {
    done(err)
  }
}));

passport.deserializeUser(async (id, done) => {
  try {
    const { username, password } = (await db.query(`
      SELECT nickname AS username, password FROM reddit_user WHERE id = ${id}
    `)).rows[0];

    done(null, { id, username, password });
  } catch (err) {
    done(err);
  }
});

passport.serializeUser((user, done) => { done(null, user.id) });

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.send("logged")
});

// Routes & services
const path = require("path")
app.use("/", express.static(path.join(__dirname, "../frontend/dist")))

const userService   = require("./services/user")(db);
const redditService = require("./services/reddit")(db);
const postService   = require("./services/post")(db);

app.use("/api", require("./routes/user")(userService));
app.use("/api", require("./routes/reddit")(redditService));
app.use("/api", require("./routes/post")(postService));

// Socket.io
const io = require("socket.io")(server, { cors: {}})
const commentService = require("./services/comment")(db);

io.of('/api').on("connection", commentService)

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
