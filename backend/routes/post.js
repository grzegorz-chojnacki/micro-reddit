const express = require("express");
const router = express.Router();
const postService = require("../services/post");
const { isAuthenticated, isSubscribed, isRedditMod } = require("../config/authentication");
const { pagination, redditNameToId } = require("../utils.js");

const oneify = n => {
  if (n === 0) return 0;
  else if (n > 0) return 1;
  else return -1;
};

// For main page posts
router.route("/p")
  .get(async (req, res) => {
    const { query, page } = pagination(req);

    const posts = await postService.getMain(req.user?.id, page, query);
    res.json(posts);
  });

// For posts
router.route("/r/:redditName/p").all(redditNameToId)
  .get(async (req, res) => {
    const { redditId } = req.params;
    const { query, page } = pagination(req);

    const posts = await postService.getAll(redditId, req.user?.id, page, query);
    res.json(posts);
  })
  .post(isSubscribed, async (req, res) => {
    const { redditId } = req.params;
    const post = req.body;

    const id = await postService.add(redditId, req.user.id, post);
    res.json({ id });
  });

// For post
router.route("/r/:redditName/p/:postId").all(redditNameToId)
  .get(async (req, res) => {
    const { redditId, postId } = req.params;

    const post = await postService.get(redditId, postId, req.user?.id);
    res.json(post);
  })
  .delete(isRedditMod, async (req, res) => {
    const { redditId, postId } = req.params;

    await postService.delete(redditId, postId);
    res.sendStatus(200);
  })
  .patch(isAuthenticated, async (req, res) => {
    const { postId } = req.params;
    const vote = oneify(Number.parseInt(req.body.vote) || 0);

    const score = await postService.vote(postId, req.user.id, vote);
    res.json(score);
  });

module.exports = router;
