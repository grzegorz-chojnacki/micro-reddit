const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.json({ id: 1, admin: true, username: 'root' });
});

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
