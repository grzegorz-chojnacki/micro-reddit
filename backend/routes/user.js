const express = require("express");
const router = express.Router();

const pagination = req => ({
  query: req.query.q || "",
  page: req.query.p  || 0
});

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

// For subscriptions
router.route("/:userId/r/:redditId")
  .put((req, res) => {
    const { userId, redditId } = req.params;
    res.sendStatus(200);
  })
  .delete((req, res) => {
    const { userId, redditId } = req.params;
    res.sendStatus(200);
  });

// For password
router.route("/:userId/password")
  .post((req, res) => {
    const { userId } = req.params;
    const email = req.body;
    res.sendStatus(200);
  });

// For homepage
router.route("/:userId/home")
  .get((req, res) => {
    const { userId } = req.params;
    const { query, page } = pagination(req);
    res.json({
      userId, query, page, reddits: [
        { id: 1, name: "A", text: "aaa" },
        { id: 3, name: "C", text: "ccc" },
        { id: 5, name: "E", text: "eee" },
      ]
    });
  });

router.use((_, res) => res.status(400).json('Bad Request'));

module.exports = router;
