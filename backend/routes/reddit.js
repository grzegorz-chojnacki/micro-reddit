const express = require("express");
const router = express.Router();
const { pagination } = require("../utils.js");

const oneify = n => {
  if (n === 0) return 0;
  else if (n > 0) return 1;
  else return -1;
};

// For reddits
router.route("/")
  .get((req, res) => {
    const { query, page } = pagination(req);

    res.json({
      query, page, reddits: [
        { id: 1, name: "A", text: "aaa" },
        { id: 2, name: "B", text: "bbb" },
        { id: 3, name: "C", text: "ccc" },
        { id: 4, name: "D", text: "ddd" },
        { id: 5, name: "E", text: "eee" },
      ]
    });
  })
  .post((req, res) => {
    const reddit = req.body;
    res.json({...reddit, id: 1000 });
  });

// For reddit
router.route("/:redditId")
  .get((req, res) => {
    const { redditId } = req.params;
    res.json({ id: redditId, name: "Z", text: "zzz" });
  })
  .put((req, res) => {
    const oldReddit = { id: 12, name: "X", text: "xxx" };
    const newReddit = req.body;
    res.json({ ...oldReddit, ...newReddit });
  });

// For reddit posts
router.route("/:redditId/p")
  .get((req, res) => {
    const { query, page } = pagination(req);
    const { redditId } = req.params;

    res.json({
      redditId, query, page,
      posts: [
        { id: 1, name: "Aaa", text: "Aaa aaa", comments: [{}] },
        { id: 2, name: "Bbb", text: "Bbb bbb", comments: [{}] },
        { id: 3, name: "Ccc", text: "Ccc ccc", comments: [{}] },
      ]
    });
  })
  .post((req, res) => {
    const post = req.body;
    res.json({ ...post, id: 2000 });
  });

// For reddit post
router.route("/:redditId/p/:postId")
  // Replaced by WebSocket (?)
  .get((req, res) => {
    const { query, page } = pagination(req);
    const { redditId, postId} = req.params

    res.json({
      redditId,
      post: {
        id: postId,
        name: "Wrr",
        text: "Wrr wrr",
        score: 100
      },
    });
  })
  .post((req, res) => {
    const post = req.body;
    res.json({ ...post, id: 5326 });
  })
  .delete((req, res) => { res.sendStatus(200) })
  .patch((req, res) => {
    const vote = oneify(Number.parseInt(req.body.vote) || 0);
    const post = { id: 99, name: "Ooo", text: "Uuu", score: 100 };

    res.json({ ...post, score: post.score + vote });
  })

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
