const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js");

const oneify = n => {
  if (n === 0) return 0;
  else if (n > 0) return 1;
  else return -1;
};

module.exports = postService => {
  // For main page posts
  router.route("/p")
    .get(async (req, res) => {
      const { query, page } = pagination(req);

      const posts = await postService.getMain(page, query);
      res.json(posts);
    });

  // For posts
  router.route("/r/:redditId/p")
    .get(async (req, res) => {
      const { redditId } = req.params;
      const { query, page } = pagination(req);

      const posts = await postService.getAll(redditId, page, query);
      res.json(posts);
    })
    .post(async (req, res) => {
      const { redditId } = req.params;
      const post = req.body;

      const id = await postService.add(redditId, post);
      res.json({ id });
    });

  // For post
  router.route("/r/:redditId/p/:postId")
    .get(async (req, res) => {
      const { redditId, postId } = req.params;

      const post = await postService.get(redditId, postId);
      res.json(post);
    })
    .delete(async (req, res) => {
      const { redditId, postId } = req.params;

      await postService.delete(redditId, postId);
      res.sendStatus(200);
    })
    .patch(async (req, res) => {
      const { redditId, postId } = req.params;
      const vote = oneify(Number.parseInt(req.body.vote) || 0);

      const score = await postService.vote(redditId, postId, vote);
      res.json(score);
    });

  return router;
};