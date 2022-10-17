var express = require("express");
const connection_database = require("../db/data");
const routers = express.Router();

routers.use(express.urlencoded());

routers
  .route("")
  .get((req, res) => {
    res.render("registation", {
      title: "login form",
    });
  })
  .post(async (req, res) => {
    try {
      const bool = await connection_database("registation_data").insert(
        req.body
      );
      if (bool.length) {
        res.send("<h1>created succussfully!! <a href='http://localhost:3000/login'>login</a>" );

      } else {
        res.send("not yet!!");
      }
    } catch (error) {
      if (error.errno == 1062) {
        res.send("<h1>this email is already exist!! <a href='http://localhost:3000/login'>Go_Back</a>  <style> *{margin:10%; font-size:80px;}");
      } else {
        res.send(error.sqlMessage);
      }
    }
  });

module.exports = routers;
