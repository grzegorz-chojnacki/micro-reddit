const express = require("express");
const router = express.Router();

router.route("/")
  .get((req, res) => {
    // const query = req.query.q || "";
    // const page = req.query.p  || 0;
    res.json([
      { id: 1, name: "A", text: "aaa" },
      { id: 2, name: "B", text: "bbb" },
      { id: 3, name: "C", text: "ccc" },
      { id: 4, name: "D", text: "ddd" },
      { id: 5, name: "E", text: "eee" },
    ]);
  })
  .post((req, res) => {
    const reddit = req.body
    res.json({...reddit, id: 1000 });
  });

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
