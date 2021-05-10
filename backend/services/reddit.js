module.exports = db => ({
  get(redditId) {
    return Promise.resolve({ id: redditId, name: "Z", text: "zzz" });
  },
  add(reddit) {
    return Promise.resolve(1000);
  },
  update(reddit) {
    const oldReddit = { id: 12, name: "X", text: "xxx" };
    return Promise.resolve({ ...oldReddit, ...reddit });
  },
  getAll(page, order) {
    return Promise.resolve([
      { id: 1, name: "A", text: "aaa" },
      { id: 2, name: "B", text: "bbb" },
      { id: 3, name: "C", text: "ccc" },
      { id: 4, name: "D", text: "ddd" },
      { id: 5, name: "E", text: "eee" },
    ]);
  },
  getPost(redditId, postId) {
    return Promise.resolve({
      id: postId,
      name: "Wrr",
      text: "Wrr wrr",
      score: 100,
    });
  },
  addPost(redditId, post) {
    return Promise.resolve(2000);
  },
  getPosts(redditId, page, order) {
    return Promise.resolve([
      { id: 1, name: "Aaa", text: "Aaa aaa", comments: [{}] },
      { id: 2, name: "Bbb", text: "Bbb bbb", comments: [{}] },
      { id: 3, name: "Ccc", text: "Ccc ccc", comments: [{}] },
    ]);
  },
  deletePost(redditId, postId) {
    return Promise.resolve(true);
  },
  votePost(redditId, postId, vote) {
    return Promise.resolve(100 + vote);
  },
});
