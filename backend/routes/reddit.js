const express = require("express");
const router = express.Router();
const redditService = require("../services/reddit");
const { pagination, redditNameToId } = require("../utils.js");
const { isAuthenticated, isRedditMod } = require("../config/authentication");

// For reddits
router.route("/r")
  .get(async (req, res) => {
    const { query, page } = pagination(req);

    try {
      const reddits = await redditService.getAll(req.user?.id, page, query);
      res.json(reddits);
    } catch (e) {
      res.status(404);
    }
  })
  .post(isAuthenticated, async (req, res) => {
    try {
      const name = await redditService.add(req.body, req.user.id);
      res.json({ name });
    } catch (e) {
      res.json({ errors: [ e.message ]});
    }
  });

// For top reddits
router.route("/tr/users")
  .get(async (_req, res) => res.json(await redditService.getTopByUsers()));

router.route("/tr/posts")
  .get(async (_req, res) => res.json(await redditService.getTopByPosts()));

// For reddit
router.route("/r/:redditName").all(redditNameToId)
  .get(async (req, res) => {
    const { redditId } = req.params;

    try {
      const reddit = await redditService.get(redditId, req.user?.id);
      res.json(reddit);
    } catch (e) {
      res.status(400);
    }
  })
  .put(isRedditMod, async (req, res) => {
    try {
      const updated = await redditService.update(req.body);
      res.json(updated);
    } catch (e) {
      res.sendStatus(404);
    }
  });

// For reddit mods
router.route("/r/:redditName/m/:username").all(redditNameToId)
  .post(isRedditMod, async (req, res) => {
    try {
      const { redditId, username } = req.params;
      await redditService.addMod(redditId, username);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(404);
    }
  });

module.exports = router;
