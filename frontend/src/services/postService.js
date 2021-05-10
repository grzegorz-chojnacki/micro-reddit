export const postService = {
  getAll() {
    return Promise.resolve([{id: 1, text: 'abc'}, {id: 2, text: 'abc'}])
  }
}
