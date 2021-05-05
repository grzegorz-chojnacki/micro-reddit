module.exports = {
  pagination: req => ({ query: req.query.q || "", page: req.query.p  || 0 }),
}
