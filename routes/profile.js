const express = require("express");
const connection_database = require("../db/data");
const fs = require("fs");

const port = 3000;
const routers = express.Router();
routers.use(express.static("views"));

routers.route("/info").get( async (req, res) => {
  const data = JSON.parse(fs.readFileSync("./login.json"));
  const totaldata = await connection_database("posts_data").where(
    "email",
    data.email
  );
  let post_comments = await connection_database("comments")
  res.status(200).json({"totaldata":totaldata,'post_comments':post_comments});
});

routers
  .route("")
  .get((req, res) => {
    res.render("profile");
  })
  .post( async (req, res) => {
    const data = JSON.parse(fs.readFileSync("./login.json"));
    req.body["email"] = data.email;
    req.body["date"] = new Date();
    const bool = await connection_database("posts_data").insert(req.body);
    res.json({ msg: "you posted new post!!!" });
    // res.redirect("http://localhost/home");
  });

module.exports = routers;
