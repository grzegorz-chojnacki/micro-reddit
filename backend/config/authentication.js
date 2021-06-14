const passport = require("passport");
const passportLocal = require("passport-local");
const db = require("./db");

passport.use(new passportLocal.Strategy(async (username, password, done) => {
  try {
    const { id } = (await db.query(`
      SELECT id FROM reddit_user
      WHERE nickname = '${username}' AND password = '${password}'
    `)).rows[0];
    done(null, { id, username });
    //  return done(null, false, { message: 'Incorrect credentials.' });
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

  const { redditId } = req.params;
  const { userId } = req.user.id;

  const { rows } = await db.query(`
    SELECT * FROM subreddit_moderator
    WHERE user_id = ${userId} AND subreddit_id = ${redditId}
  `);

  return rows.length === 1 ? next() : res.sendStatus(403);
};

const isSubscribed = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);

  const redditId = req.params.redditId;
  const userId = req.user.id;

  const { rows } = await db.query(`
    SELECT * FROM subreddit_user
    WHERE user_id = ${userId} AND subreddit_id = ${redditId}
  `);

  return rows.length === 1 ? next() : res.sendStatus(403);
};

module.exports = { passport, isAuthenticated, isRedditMod, isSubscribed };