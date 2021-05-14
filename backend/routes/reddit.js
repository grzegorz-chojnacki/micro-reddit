const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js");

const oneify = n => {
  if (n === 0) return 0;
  else if (n > 0) return 1;
  else return -1;
};

module.exports = redditService => {
  // For reddits
  router.route("/")
    .get(async (req, res) => {
      const { query, page } = pagination(req);

      const reddits = await redditService.getAll(page, query);
      res.json(reddits);
    })
    .post(async (req, res) => {
      const reddit = req.body;

      const id = await redditService.add(reddit);
      res.json({ ...reddit, id });
    });

  // For reddit
  router.route("/:redditId")
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
}