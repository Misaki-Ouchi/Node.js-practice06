const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "calender",
  multipleStatements: true,
});

// cssファイルの取得
app.use(express.static("assets"));

app.get("/", (req, res) => {
  const sql = "SELECT * from schedule;";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      schedule: result
    });
  });
});

app.get("/create/:date", (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"));
});

// スケジュール編集
// app.get("/edit/:date", (req, res) => {
//   const sql = `SELECT * FROM schedule WHERE date = ${req.params.date}`;
//   const sql2 = `INSERT INTO schedule(id, date, title, username, content) VALUES (0, ${req.params.date}, ?, ?, ?)`;
//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.render("edit", {
//       schedule: result,
//     });
//   });
// });

app.post("/", (req, res) => {
  console.log(req.params.id);
  const sql = `INSERT INTO schedule(date, title, username, content, id) VALUES (0, ?, ?, ?, 0)`
  con.query(
    sql,
    [
      req.body.date,
      req.body.title,
      req.body.username,
      req.body.content,
      req.body.id
    ],
    function (err, result, fields) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
