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

  // For reddit posts
  router.route("/:redditId/p")
    .get(async (req, res) => {
      const { query, page } = pagination(req);
      const { redditId } = req.params;

      const posts = await redditService.getPosts(redditId, page, query);
      res.json(posts);
    })
    .post(async (req, res) => {
      const post = req.body;
      const id = await redditService.addPost(post);
      res.json({ ...post, id });
    });

  // For reddit post
  router.route("/:redditId/p/:postId")
    // Replaced by WebSocket (?)
    .get(async (req, res) => {
      const { redditId, postId} = req.params;

      const post = await redditService.getPost(redditId, postId);
      res.json(post);
    })
    .delete(async (req, res) => {
      const { redditId, postId} = req.params;

      await redditService.deletePost(redditId, postId);
      res.sendStatus(200)
    })
    .patch(async (req, res) => {
      const { redditId, postId} = req.params;
      const vote = oneify(Number.parseInt(req.body.vote) || 0);

      const score = await redditService.votePost(redditId, postId, vote);
      res.json(score);
    })

  router.use((_, res) => res.status(400).json('Bad Request'));
  return router;
}