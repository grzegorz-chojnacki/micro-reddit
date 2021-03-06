const express = require("express");
const router = express.Router();
const userService = require("../services/user");
const postService = require("../services/post");
const emailService = require("../services/email");
const { isAuthenticated } = require("../config/authentication");
const { pagination, redditNameToId } = require("../utils.js");

// For adding users
router.route("/u")
  .post(async (req, res) => {
    try {
      const user = req.body;
      await userService.add(user);
      res.sendStatus(200);
    } catch (e) {
      res.json({ errors: [e.message] });
    }
  });

// For logged user
router.route("/u").all(isAuthenticated)
  .get(async (req, res) => {
    try {
      res.json(await userService.get(req.user.id));
    } catch (e) {
      res.sendStatus(404);
    }
  })
  .patch(async (req, res) => {
    const userId = req.user.id;
    const { password, changes } = req.body;

    try {
      const updated = await userService.patch(password, changes, userId);
      res.json({ user: {...updated, ...await userService.get(userId) }});
    } catch (e) {
      res.json({ errors: [e.message] });
    }
  })
  .delete(async (req, res) => {
    const userId = req.user.id;

    try {
      await userService.delete(userId);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(404);
    }
  });

// For logged user subscriptions
router.route("/u/r/:redditName").all(redditNameToId)
  .patch(isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const { redditId } = req.params;
    const { state } = req.body;

    try {
      await userService.setSubscribe(redditId, userId, state);
      res.json({ state });
    } catch (e) {
      res.sendStatus(404);
    }
  }),

// For sending password to username email
router.route("/u/password")
  .post(async (req, res) => {
    try {
      const user = await userService.getUsername(req.body.username);
      await emailService.remindPassword(user);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

// For logged user homepage posts
router.route("/u/home").all(isAuthenticated)
  .get(async (req, res) => {
    const userId = req.user.id;
    const { query, page } = pagination(req);

    try {
      const reddits = await postService.getHome(userId, page, query);
      res.json(reddits);
    } catch (e) {
      res.sendStatus(404);
    }
  });

module.exports = router;
