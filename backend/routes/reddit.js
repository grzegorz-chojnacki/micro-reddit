const express = require("express");
const router = express.Router();

const pagination = req => ({
  query: req.query.q || "",
  page: req.query.p  || 0
});

router.route("/")
  .get((req, res) => {
    const { query, page } = pagination(req)

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
    const reddit = req.body
    res.json({...reddit, id: 1000 });
  });

router.route("/:reddit")
  .get((req, res) => {
    const redditId = req.params.reddit
    res.json({ id: redditId, name: "Z", text: "zzz" })
  })
  .put((req, res) => {
    const oldReddit = { id: 12, name: "X", text: "xxx" }
    const newReddit = req.body
    res.json({ ...oldReddit, ...newReddit })
  });

router.route("/:reddit/p")
  .get((req, res) => {
    const { query, page } = pagination(req)
    const redditId = req.params.reddit

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
    const post = req.body
    res.json({ ...post, id: 2000 });
  });


router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
