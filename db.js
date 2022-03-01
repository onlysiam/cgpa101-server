const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.static(__dirname));

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  // user: "onlysiam_nsu",
  // host: "localhost",
  // password: process.env.db_password,
  // database: "onlysiam_cgpa101",
  user: "root",
  host: "localhost",
  password: "ot.siam07ilvnba07",
  database: "onlysiam_cgpa101",
});

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  db.query(
    "INSERT INTO user (fname,lname,username,password) VALUES (?,?,?,?)",
    [firstName, lastName, username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result) {
        res.send(result);
      }
    }
  );
});

app.post("/api/authentication", (req, res) => {
  const username = req.body.usernameInput;
  const password = req.body.passwordInput;
  db.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        console.log(err);

        console.log("!!!");
        res.send(err);
      }
    }
  );
});

app.post("/api/courses", (req, res) => {
  console.log(req.body);
  const username = req.body.usernameInput;
  db.query(
    "SELECT * FROM courses WHERE user_id LIKE ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        console.log("No Data Found");
        res.send(result);
      }
    }
  );
});
app.post("/api/addcourses", (req, res) => {
  const course_name = req.body.course;
  const credit_hour = req.body.credit;
  const grade_letter = req.body.grade;
  const grade_point = req.body.gradePoint;
  const semester_id = req.body.semester;
  const user_id = req.body.user;
  const active = 1;
  db.query(
    "INSERT INTO courses (course_name, credit_hour, grade_letter, grade_point, semester_id, user_id, active) VALUES (?,?,?,?,?,?,?)",
    [
      course_name,
      credit_hour,
      grade_letter,
      grade_point,
      semester_id,
      user_id,
      active,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        const course_id = result.insertId;
        res.send({
          course_id,
          course_name,
          credit_hour,
          grade_letter,
          grade_point,
          semester_id,
          user_id,
          active,
        });
      }
    }
  );
});
// app.patch("/api/courses/:id", (req, res) => {
//   const course_id = parseInt(req.params.id);
//   db.query(
//     "DELETE FROM courses WHERE course_id = ?",
//     [course_id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send({ err: err });
//       }
//       if (result.length > 0) {
//         console.log(result);
//         res.send(result);
//       } else {
//         res.send(req.params.id);
//       }
//     }
//   );
// });
app.patch("/api/courses/:courseId", (req, res) => {
  const course_id = parseInt(req.params.courseId);
  db.query(
    "UPDATE courses SET active = !active WHERE course_id = ?",
    [course_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        res.send(req.params.id);
      }
    }
  );
});
app.post("/api/semesters", (req, res) => {
  console.log(req.body);
  const username = req.body.usernameInput;
  db.query(
    "SELECT * FROM semesters WHERE user_id LIKE ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        console.log("No Data Found");
        res.send({ message: "Incorrect Password" });
      }
    }
  );
});

app.post("/api/addsemesters", (req, res) => {
  const semester_name = req.body.semester;
  const user_id = req.body.name;
  const semester_gpa = null;
  const course_count = null;
  db.query(
    "INSERT INTO semesters (semester_name, semester_gpa, course_count, user_id, active) VALUES (?,?,?,?,?)",
    [semester_name, semester_gpa, course_count, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        const semester_id = result.insertId;
        res.send({
          semester_id,
          semester_name,
          semester_gpa,
          course_count,
          user_id,
        });
      }
    }
  );
});

app.patch("/api/semesters/:id", (req, res) => {
  const semester_id = parseInt(req.params.id);
  db.query(
    "DELETE FROM semesters WHERE semester_id = ?",
    [semester_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log(result);
        res.send(result);
      } else {
        res.send(req.params.id);
      }
    }
  );
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});
app.listen(3001, () => {
  console.log("running server");
});
