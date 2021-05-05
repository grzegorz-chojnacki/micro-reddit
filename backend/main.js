require("dotenv").config();
const port = process.env.PORT || 8080

// Server setup
const express = require("express");
const app  = express();
const http = require("http").createServer(app);
// const io   = require("socket.io")(http);

// Database setup
// const db = new (require("pg").Client)({
//   host:     process.env.PGHOST || "127.0.0.1",
//   port:     process.env.PGPORT || 5432,
//   database: process.env.PGDB,
//   user:     process.env.PGUSER,
//   password: process.env.PGPASSWORD,
// });
// db.connect();

// Other setup
const fs = require("fs");
// const axios      = require("axios");
// const passport   = require("passport");
// const nodemailer = require("nodemailer");

// Express
app.use(express.json());

app.use("/api/r", require("./routes/reddit"));
app.use("/api/u", require("./routes/user"));

app.use("/", (_, res) => {
  const root = "../frontend/dist/"
  const index = "index.html"
  if (fs.existsSync(`${root}${index}`)) {
    res.sendFile(index, { root })
  } else {
    res.status(500).send("File not found")
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
