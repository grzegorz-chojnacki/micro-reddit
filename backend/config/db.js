const db = new (require("pg").Client)({
  host:     process.env.PGHOST || "127.0.0.1",
  port:     process.env.PGPORT || 5432,
  database: process.env.PGDB,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

db.connect();

module.exports = db;
