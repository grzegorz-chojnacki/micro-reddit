require("dotenv").config();
const port = process.env.PORT || 8080

// Server setup
const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);

// Database setup
const db = new (require("pg").Client)({
  host:     process.env.PGHOST || "127.0.0.1",
  port:     process.env.PGPORT || 5432,
  database: process.env.PGDB,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
});
db.connect();

// Other setup
const axios      = require("axios");
const passport   = require("passport");
const nodemailer = require("nodemailer");


// Express
app.get();

app.listen(port, () => {
  console.log(`Hello, World! (${port})`);
});
