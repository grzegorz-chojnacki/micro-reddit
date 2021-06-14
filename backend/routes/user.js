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
      } catch (errors) {
        res.json({ errors });
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
    .patch(async (req, res) => {
      const userId = req.user.id;
      const { redditId } = req.params;
      const { state } = req.body;

      userService.setSubscribe(redditId, userId, state);
      res.sendStatus(200);
    }),

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
