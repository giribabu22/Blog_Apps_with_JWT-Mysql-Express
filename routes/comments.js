const expr = require('express');
const connection_database = require('../db/data')
const fs = require('fs');


const routers = expr.Router();


routers.get('/:id/:post_email', async (req,res)=>{
    res.render('comments')
})
.post('/:id/:post_email', async (req,res)=>{
    try {
        let {id,post_email} = req.params;
        id = id.slice(1)
        post_email = post_email.slice(1)
        let {email} = await JSON.parse(fs.readFileSync('login.json'))
        await connection_database('comments').insert({feeling_msg:req.body.massage,post_id:id,date:new Date(),user_email:email})
        res.redirect('http://localhost:3000/comments'+req.url);

    } catch (error) {
    }
})



module.exports = routers