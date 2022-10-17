const express = require("express");
const app = express();
const hbs = require("hbs");
const fs = require('fs')
const { veryfyToken, genrateToken } = require("./json_web_token/web_token");

const port = process.env.PORT || 3000;

app.set("views", "views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded());
app.use("/registation", require("./routes/registation"));
app.use("/login", require("./routes/login"));
app.use("/home", veryfyToken,require("./routes/home"));
app.use("/comments",veryfyToken, require("./routes/comments"));
app.use("/profile",veryfyToken, require("./routes/profile"));
app.use('/del',veryfyToken,require('./routes/del'))

app.get("/logout",veryfyToken, (req,res)=>{
    fs.writeFileSync('login.json',JSON.stringify({},null,3))
    res.cookie("user", undefined);
    res.redirect(`http://localhost:${port}/login`);
})


app.listen(port);