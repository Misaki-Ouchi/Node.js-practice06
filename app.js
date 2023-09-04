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

// スケジュールの追加
app.get("/create/:date", (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"));
});

app.post("/", (req, res) => {
  console.log(req.params.id);
  const sql = "INSERT INTO schedule (id, date, title, username, content) VALUES (?, ?, ?, ?, ?)"
  con.query(
    sql,
    [
      req.body.id,
      req.body.date,
      req.body.title,
      req.body.username,
      req.body.content
    ],
    function (err, result, fields) {
      if (err) throw err;
      // res.send("スケジュールを追加しました");
    }
  );
});

// スケジュールの表示
app.get("/show/:id", (req, res) => {
  const sql = `SELECT * FROM schedule WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("show", {
      schedule: result,
    });
  });
});

// スケジュール編集
app.get("/edit/:id", (req, res) => {
  const sql = `SELECT * FROM schedule WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      schedule: result,
    });
  });
});

app.post("/update/:id", (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE schedule SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect(`/show/${req.params.id}`);
  });
});

// スケジュール削除
app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM schedule WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    // res.send("スケジュールを削除しました");
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
