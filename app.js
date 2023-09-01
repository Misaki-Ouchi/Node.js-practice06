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

// スケジュール編集
app.get("/edit/:date", (req, res) => {
  const sql = "SELECT * FROM schedule WHERE date = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      schedule: result,
    });
  });
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO schedule(date, title, username, content) VALUES (?, ?, ?, ?)";
  con.query(
    sql,
    [req.body.date],
    function (err, result, fields) {
      if (err) throw err;
      res.redirect("/shopBask");
    }
  );
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
