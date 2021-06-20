const passport = require("passport");
const passportLocal = require("passport-local");
const db = require("./db");

passport.use(new passportLocal.Strategy(async (username, password, done) => {
  try {
    const { id, email, role } = (await db.query(`
      SELECT ru.id, email, role_name AS role
      FROM reddit_user AS ru
      LEFT JOIN user_role AS ur
        ON ur.id = ru.id
      LEFT JOIN role AS r ON r.id = role_id
      WHERE nickname = '${username}' AND password = '${password}'
    `)).rows[0];

    const modding = (await db.query(`
      SELECT s.id, s.name
      FROM subreddit AS s
      INNER JOIN subreddit_moderator AS sm
        ON s.id = sm.subreddit_id
      WHERE sm.user_id = ${id}
    `)).rows;

    done(null, { id, username, email, modding, admin: role === "administrator" });
  } catch (err) {
    done(err);
  }
}));

passport.deserializeUser(async (id, done) => {
  try {
    const { username } = (await db.query(`
      SELECT nickname AS username FROM reddit_user WHERE id = ${id}
    `)).rows[0];

    done(null, { id, username });
  } catch (err) {
    done(err);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else return res.sendStatus(401);
};

const isRedditMod = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);

  try {
    const redditId = req.params.redditId;
    const userId = req.user.id;

    const isAdmin = (await db.query(`
      SELECT * FROM reddit_user AS ru
      LEFT JOIN user_role AS ur
        ON ur.id = ru.id
      LEFT JOIN role AS r ON r.id = role_id
      WHERE ru.id = ${userId} AND role_name = 'administrator'
    `)).rows.length === 1;

    const isMod = (await db.query(`
      SELECT * FROM subreddit_moderator
      WHERE user_id = ${userId} AND subreddit_id = ${redditId}
    `)).rows.length === 1;

    return (isAdmin || isMod) ? next() : res.sendStatus(403);
  } catch (e) {
    res.sendStatus(404);
  }
};

const isSubscribed = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);

  try {
    const redditId = req.params.redditId;
    const userId = req.user.id;

    const { rows } = await db.query(`
      SELECT * FROM subreddit_user
      WHERE user_id = ${userId} AND subreddit_id = ${redditId}
    `);

    return rows.length === 1 ? next() : res.sendStatus(403);
  } catch (e) {
    res.sendStatus(404);
  }
};

module.exports = { passport, isAuthenticated, isRedditMod, isSubscribed };
