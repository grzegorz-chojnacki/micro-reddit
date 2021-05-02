require("dotenv").config();
const port = process.env.PORT || 8080

// Server setup
const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);

// Database setup
const { Client } = require("pg");
const credentials = {
  host:     process.env.PGHOST || "127.0.0.1",
  port:     process.env.PGPORT || 5432,
  database: process.env.PGDB,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWD,
};
const client = new Client(credentials);
// client.connect();

// Other setup
const axios      = require("axios");
const passport   = require("passport");
const nodemailer = require("nodemailer");


app.listen(port, () => {
  console.log(`Hello, World! (${port})`);
});
