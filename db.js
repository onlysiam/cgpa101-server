const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

require("dotenv").config();
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

//Database Connection
const db = mysql.createConnection({
   user: "onlysiam_nsu",
   host: "localhost",
   password: process.env.db_password,
   database: "onlysiam_cgpa101",
//   user: "root",
//   host: "localhost",
//   password: "ot.siam07ilvnba07",
//   database: "onlysiam_cgpa101",
});

app.get("/hey", (req, res) => {
  res.send("heyyy);
});
//new user signup
app.post("/api/register", (req, res) => {
  console.log(req.body);
  const username = req.body.usernameInput;
  const password = req.body.passwordInput;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const cgpa = 0;
  const credit_completed = 0;
  db.query(
    "INSERT INTO user (fname,lname,username,password,cgpa,credit_completed) VALUES (?,?,?,?,?,?)",
    [fname, lname, username, password, cgpa, credit_completed],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result) {
        res.send([
          { username, password, fname, lname, cgpa, credit_completed },
        ]);
      }
    }
  );
});

//old user login
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

//default grade weights load
app.get("/api/defaultgrade", (req, res) => {
  db.query("SELECT * FROM default_grade_weights", (err, result) => {
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
  });
});

//users grade weights load
app.post("/api/userGrade", (req, res) => {
  console.log(req.body);
  const username = req.body.usernameInput;
  db.query(
    "SELECT * FROM grade_weights WHERE username LIKE ?",
    [username],
    (err, result) => {
      if (err) {
        console.log("err:", err);
      }
      if (result.length > 0) {
        console.log("poop");
        res.send(result);
      }
      if (result.length === 0) {
        db.query("SELECT * FROM default_grade_weights", (err, result) => {
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
        });
      }
    }
  );
});
//course load
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

//new course add
app.post("/api/addcourses", (req, res) => {
  const course_name = req.body.course;
  const credit_hour = req.body.credit;
  const grade_letter = req.body.grade;
  const grade_point = req.body.gradePoint;
  const grade_id = req.body.gradeId;
  const semester_id = req.body.semester;
  const user_id = req.body.username;
  const active = 1;
  db.query(
    "INSERT INTO courses (course_name, credit_hour, grade_letter, grade_point, grade_id, semester_id, user_id, active) VALUES (?,?,?,?,?,?,?,?)",
    [
      course_name,
      credit_hour,
      grade_letter,
      grade_point,
      grade_id,
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
          grade_id,
          semester_id,
          user_id,
          active,
        });
      }
    }
  );
});

//delete course
app.patch("/api/courseremoved/:id", (req, res) => {
  const course_id = parseInt(req.params.id);
  db.query(
    "DELETE FROM courses WHERE course_id = ?",
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

//active inactive course
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

//load semesters
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
        res.send(result);
      }
    }
  );
});

//add new semester
app.post("/api/addsemesters", (req, res) => {
  const semester_name = req.body.semester;
  const user_id = req.body.username;
  const semester_gpa = null;
  const semester_credit = null;
  const active = 1;
  db.query(
    "INSERT INTO semesters (semester_name, semester_gpa, semester_credit, user_id, active) VALUES (?,?,?,?,?)",
    [semester_name, semester_gpa, semester_credit, user_id, active],
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
          semester_credit,
          user_id,
          active,
        });
      }
    }
  );
});

//remove a semester
app.patch("/api/semesteremoved/:id", (req, res) => {
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

//active inactive semester with its courses
app.patch("/api/semesters/:semesterId", (req, res) => {
  const semester_id = parseInt(req.params.courseId);
  db.query(
    "UPDATE semesters, courses SET semesters.active = !semesters.active, courses.active = !courses.active WHERE semesters.semester_id = courses.semester_id AND semesters.semester_id = ?",
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
app.listen(process.env.PORT || 3000);
