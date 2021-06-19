const express = require("express");
const router = express.Router();
const redditService = require("../services/reddit");
const { pagination, redditNameToId } = require("../utils.js");
const { isAuthenticated, isRedditMod } = require("../config/authentication");

// For reddits
router.route("/r")
  .get(async (req, res) => {
    const { query, page } = pagination(req);

    const reddits = await redditService.getAll(req.user?.id, page, query);
    res.json(reddits);
  })
  .post(isAuthenticated, async (req, res) => {
    const name = await redditService.add(req.body, req.user.id);
    res.json({ name });
  });

// For top reddits by user count
router.route("/tr/users")
  .get(async (_req, res) => res.json(await redditService.getTopByUsers()));

router.route("/tr/posts")
  .get(async (_req, res) => res.json(await redditService.getTopByPosts()));

// For reddit
router.route("/r/:redditName").all(redditNameToId)
  .get(async (req, res) => {
    const { redditId } = req.params;
    const reddit = await redditService.get(redditId, req.user?.id);
    res.json(reddit);
  })
  .put(isRedditMod, async (req, res) => {
    try {
      const reddit = req.body;

      if (reddit.description.length >= 256) {
        throw new Error();
      }

      const updated = await redditService.update(reddit);
      res.json(updated);
    } catch (e) {
      res.sendStatus(400);
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
      res.sendStatus(400);
    }
  });

module.exports = router;
