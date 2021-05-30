const express = require("express");
const { isAuthenticated } = require("../config/authentication");
const router = express.Router();
const { pagination } = require("../utils.js");

module.exports = userService => {
  // For adding users
  router.route("/u")
    .post(async (req, res) => {
      try {
        const user = req.body;
        await userService.add(user);
        res.sendStatus(200);
      } catch (e) {
        res.sendStatus(500);
      }
    });

  // For logged user
  router.route("/u").all(isAuthenticated)
    .get(async (req, res) => {
      res.json(await userService.get(req.user.id));
    })
    .put(async (req, res) => {
      const userId = req.user.id;
      const user = {...req.body, id: userId};

      const updated = await userService.update(user);

      res.json(updated);
    })
    .delete(async (req, res) => {
      const userId = req.user.id;

      await userService.delete(userId);
      res.sendStatus(200);
    });

  // For logged user subscriptions
  router.route("/u/r/:redditId").all(isAuthenticated)
    .put(async (req, res) => {
      const userId = req.user.id;
      const { redditId } = req.params;

      userService.setSubscribe(userId, redditId, true);
      res.sendStatus(200);
    })
    .delete(async (req, res) => {
      const { userId, redditId } = req.params;

      userService.setSubscribe(userId, redditId, false);
      res.sendStatus(200);
    });

  // For logged user password
  router.route("/u/password").all(isAuthenticated)
    .post(async (req, res) => {
      const userId = req.user.id;
      // const email = req.body;
      const randomPassword = "";

      userService.setPassword(userId, randomPassword);
      // emailService.sendEmail(email, passwordResetEmail);

      res.sendStatus(200);
    });

  // For logged user homepage posts
  router.route("/u/home").all(isAuthenticated)
    .get(async (req, res) => {
      const userId = req.user.id;
      const { query, page } = pagination(req);

      const reddits = await userService.getHome(userId, page, query);

      res.json(reddits);
    });

  return router;
};
