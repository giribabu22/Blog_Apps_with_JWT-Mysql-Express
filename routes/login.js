const { genrateToken } = require("../json_web_token/web_token");
const connection_database = require("../db/data");
const express = require("express");
const fs = require("fs");
const routers = express.Router();

routers.use(express.json());

routers.get("", (req, res) => {
  res.render("login");
});

routers.post("", async (req, res) => {
  const user = await connection_database("registation_data")
    .where("email", req.body.email)
    .where("password", req.body.password);
  if (user.length) {
    const token = await genrateToken(req.body.email);
    res.cookie("user", token);
    fs.writeFileSync("./login.json", JSON.stringify(user[0], null, 3));
    res.redirect("http://localhost:3000/home");
  } else {
    res.cookie("user", undefined);
    res.send("<h1>invallid input!! <a href='http://localhost:3000/login'> Go_Back</a>  <style> *{margin:10%; font-size:80px;}" );
  }
});

module.exports = routers;
