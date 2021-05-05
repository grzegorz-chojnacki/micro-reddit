const express = require("express");
const router = express.Router();

router.route("/")
  .get((req, res) => {
    const query = req.query.q || "";
    const page = req.query.p  || 0;
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

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
