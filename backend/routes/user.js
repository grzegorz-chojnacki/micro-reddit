const express = require("express");
const router = express.Router();

// For users
router.route("/")
  .get((req, res) => {
    res.json({ id: 1, admin: true, username: 'root' });
  })
  .post((req, res) => {
    const user = req.body;
    res.json({ ...user, id: 1337 });
  });

// For user
router.route("/:userId")
  .put((req, res) => {
    const { userId } = req.params;
    const user = req.body;
    res.json({ ...user, id: userId });
  })
  .delete((req, res) => { res.sendStatus(200); });

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
