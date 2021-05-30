const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js");
const { isAuthenticated } = require("../config/authentication");

module.exports = redditService => {
  // For reddits
  router.route("/r")
    .get(async (req, res) => {
      const { query, page } = pagination(req);

      const reddits = await redditService.getAll(page, query);
      res.json(reddits);
    })
    .post(isAuthenticated, async (req, res) => {
      const id = await redditService.add(req.body, req.user.id);
      res.json({ id });
    });

  // For reddit
  router.route("/r/:redditId")
    .get(async (req, res) => {
      const { redditId } = req.params;
      const reddit = await redditService.get(redditId);
      res.json(reddit);
    })
    .put(async (req, res) => {
      const reddit = req.body;
      const updated = await redditService.update(reddit);
      res.json(updated);
    });

  return router;
};