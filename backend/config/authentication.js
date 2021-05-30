const passport = require("passport");
const passportLocal = require("passport-local");
const db = require("./db");

passport.use(new passportLocal.Strategy(async (username, password, done) => {
  try {
    const { rows } = await db.query(`
      SELECT id FROM reddit_user
      WHERE nickname = '${username}' AND password = '${password}'
    `);
    done(null, { id: rows[0].id });
    //  return done(null, false, { message: 'Incorrect credentials.' });
  } catch (err) {
    done(err);
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

passport.serializeUser((user, done) => {
 done(null, user.id);
});

const isAuthenticated = (req, res, next) => {
  console.log('logged', req.user, req.sessionID)
  if (req.isAuthenticated()) return next();
  else return res.sendStatus(401);
};

module.exports = { passport, isAuthenticated };