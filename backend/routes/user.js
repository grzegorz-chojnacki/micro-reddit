const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js")

module.exports = userService => {
  // For users
  router.route("/")
    .get(async (req, res) => {
      res.json(await userService.get(1));
    })
    .post(async (req, res) => {
      const user = req.body;
      const id = await userService.add(user);
      res.json({...user, id});
    });

  // For user
  router.route("/:userId")
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
  router.route("/:userId/r/:redditId")
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
  router.route("/:userId/password")
    .post(async (req, res) => {
      const { userId } = req.params;
      const email = req.body;
      const randomPassword = '';

      userService.setPassword(userId, randomPassword);
      // emailService.sendEmail(email, passwordResetEmail);

      res.sendStatus(200);
    });

  // For homepage
  router.route("/:userId/home")
    .get(async (req, res) => {
      const { userId } = req.params;
      const { query, page } = pagination(req);

      const reddits = userService.getHome(userId, page, query);

      res.json(reddits);
    });

  router.use((_, res) => res.status(400).json('Bad Request'));
  return router;
}
