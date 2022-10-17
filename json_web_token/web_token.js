const jwt = require('jsonwebtoken')

async function genrateToken(id){
    return jwt.sign(id,'oihskzdfdhsdkdhskdhskdhjdd')
}

async function veryfyToken(req,res,next){
    try{
    if(req.headers.cookie && req.headers.cookie.split('=')[1] != 'undefined'){
        const token = req.headers.cookie.split('=')[1]
        jwt.verify(token,'oihskzdfdhsdkdhskdhskdhjdd')
        next()
    }else{
        res.send("<h1> log-in first <a href='http://localhost:3000/login'>login</a> <style> *{margin:10%; font-size:80px;}")
    }}catch(error){
        console.log(error);
    }
}

module.exports = {veryfyToken,genrateToken}