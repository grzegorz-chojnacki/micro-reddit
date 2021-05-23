const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js")

module.exports = userService => {
  // For users
  router.route("/u")
    .post(async (req, res) => {
      const user = req.body;
      const id = await userService.add(user);
      res.json({...user, id});
    });

  // For user
  router.route("/u/:userId")
    .get(async (req, res) => {
      const { userId } = req.params;
      res.json(await userService.get(userId));
    })
    .put(async (req, res) => {
      const { userId } = req.params;
      const user = {...req.body, id: userId};

      const updated = await userService.update(user);

      res.json(updated);
    })
    .delete(async (req, res) => {
      const { userId } = req.params;

      await userService.delete(userId);
      res.sendStatus(200);
    });

  // For subscriptions
  router.route("/u/:userId/r/:redditId")
    .put(async (req, res) => {
      const { userId, redditId } = req.params;

      userService.setSubscribe(userId, redditId, true);
      res.sendStatus(200);
    })
    .delete(async (req, res) => {
      const { userId, redditId } = req.params;

      userService.setSubscribe(userId, redditId, false);
      res.sendStatus(200);
    });

  // For password
  router.route("/u/:userId/password")
    .post(async (req, res) => {
      const { userId } = req.params;
      const email = req.body;
      const randomPassword = '';

      userService.setPassword(userId, randomPassword);
      // emailService.sendEmail(email, passwordResetEmail);

      res.sendStatus(200);
    });

  // For homepage posts
  router.route("/u/:userId/home")
    .get(async (req, res) => {
      const { userId } = req.params;
      const { query, page } = pagination(req);

      const reddits = await userService.getHome(userId, page, query);

      res.json(reddits);
    });

  return router;
}
