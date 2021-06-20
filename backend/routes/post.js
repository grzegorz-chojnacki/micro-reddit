const express = require("express");
const postService = require("../services/post.js");
const router = express.Router();
const { isAuthenticated, isSubscribed, isRedditMod } = require("../config/authentication");
const { pagination, redditNameToId } = require("../utils.js");

const oneify = n => {
  if (n === 0) return 0;
  else if (n > 0) return 1;
  else return -1;
};

module.exports = io => {
  // For main page posts
  router.route("/p")
    .get(async (req, res) => {
      const { query, page } = pagination(req);

      try {
        const posts = await postService.getMain(req.user?.id, page, query);
        res.json(posts);
      } catch (e) {
        res.sendStatus(400);
      }
    });

  // For posts
  router.route("/r/:redditName/p").all(redditNameToId)
    .get(async (req, res) => {
      const { redditId } = req.params;
      const { query, page } = pagination(req);

      try {
        const posts = await postService.getAll(redditId, req.user?.id, page, query);
        res.json(posts);
      } catch (e) {
        res.sendStatus(400);
      }
    })
    .post(isSubscribed, async (req, res) => {
      const { redditId } = req.params;
      const post = req.body;

      try {
        const id = await postService.add(redditId, req.user.id, post);
        res.json({ id });
      } catch (e) {
        res.json({ errors: [e.message] });
      }
    });

  // For post
  router.route("/r/:redditName/p/:postId").all(redditNameToId)
    .get(async (req, res) => {
      const { redditId, postId } = req.params;

      try {
        const post = await postService.get(redditId, postId, req.user?.id);
        res.json(post);
      } catch (e) {
        res.sendStatus(404);
      }
    })
    .delete(isRedditMod, async (req, res) => {
      const { redditId, postId } = req.params;

      try {
        await postService.delete(redditId, postId);
        io.to(postId).emit("deletePost");
        io.to(redditId).emit("deletePost", { postId });
        res.sendStatus(200);
      } catch (e) {
        res.sendStatus(404);
      }
    })
    .patch(isAuthenticated, async (req, res) => {
      const { postId } = req.params;
      const vote = oneify(Number.parseInt(req.body.vote) || 0);

      try {
        const score = await postService.vote(postId, req.user.id, vote);
        res.json(score);
      } catch (e) {
        res.sendStatus(400);
      }
    });
  return router;
};
