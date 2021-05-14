module.exports = db => ({
  get(redditId, postId) {
    return Promise.resolve({
      id: postId,
      name: "Wrr",
      text: "Wrr wrr",
      score: 100,
      voted: 1,
      reddit: {
        id: redditId,
        name: 'Rrrr'
      }
    });
  },
  add(redditId, post) {
    return Promise.resolve(1000);
  },
  update(redditId, postId, post) {
    const oldPost = { id: 12, name: "X", text: "xxx" };
    return Promise.resolve({ ...oldPost, ...post });
  },
  getAll(redditId, page, order) {
    return Promise.resolve([
      { id: 1, name: "A", score: 100, text: "aaa", voted:  1, reddit: { name: 'Rrrr', id: redditId }},
      { id: 2, name: "B", score: 120, text: "bbb", voted: -1, reddit: { name: 'Rrrr', id: redditId }},
      { id: 3, name: "C", score: 200, text: "ccc", voted:  0, reddit: { name: 'Rrrr', id: redditId }},
      { id: 4, name: "D", score: 102, text: "ddd", voted: -1, reddit: { name: 'Rrrr', id: redditId }},
      { id: 5, name: "E", score: 110, text: "eee", voted:  1, reddit: { name: 'Rrrr', id: redditId }},
    ]);
  },
  delete(redditId, postId) {
    return Promise.resolve(true);
  },
  vote(redditId, postId, vote) {
    return Promise.resolve(100 + vote);
  },
  getMain(page, order) {
    return Promise.resolve([
      { id: 1, name: "A", score: 100, text: "aaa", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 2, name: "B", score: 120, text: "bbb", voted:  0, reddit: { name: 'Rrrr', id: 2 }},
      { id: 3, name: "C", score: 200, text: "ccc", voted:  1, reddit: { name: 'Rrrr', id: 1 }},
      { id: 4, name: "D", score: 102, text: "ddd", voted:  0, reddit: { name: 'Rrrr', id: 3 }},
      { id: 5, name: "E", score: 110, text: "eee", voted: -1, reddit: { name: 'Rrrr', id: 2 }},
    ]);
  }
});