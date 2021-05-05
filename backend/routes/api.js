const express = require("express");
const router = express.Router();

router.route("/r").get((req, res) => {
  res.json([
    { id: 1, name: "A", text: "aaa" },
    { id: 2, name: "B", text: "bbb" },
    { id: 3, name: "C", text: "ccc" },
    { id: 4, name: "D", text: "ddd" },
    { id: 5, name: "E", text: "eee" },
  ]);
});

module.exports = router;
