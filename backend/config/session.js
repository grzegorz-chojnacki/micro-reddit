const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const client = redis.createClient();

client.on("error", err => {
  console.error(err);
});

const sessionStore = new RedisStore({ client });

module.exports = session({
  secret: process.env.SECRET,
  store: sessionStore,
  cookie: {
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  resave: false,
  saveUninitialized: false,
});
