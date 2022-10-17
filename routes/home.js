const express = require("express");
const connection_database = require("../db/data");
const fs = require("fs");

const routers = express.Router();
routers.use(express.static("public"));

routers.route("/info").get( async (req, res) => {
  const totaldata = await connection_database("posts_data").select();
  let post_comments = await connection_database("comments")
  res.status(200).json({"totaldata":totaldata,'post_comments':post_comments});
});


routers.get('/likes/:id/:post_email/:update', async (req,res)=>{
  try {
      let {id,post_email,update} = req.params;
      id = id.slice(1)
      post_email = post_email.slice(1)
      update = update.slice(1)
      let {email} = await JSON.parse(fs.readFileSync('login.json'))

      //getting data from database
      let this_post =  await connection_database('posts_data').where('email',post_email).where('id',id)
      let post_feedback = await connection_database("feedback").where('user_email',email).where('post_id',id)

      if (!post_feedback.length){
          this_post[0].likes += 1
          await connection_database("feedback").insert({'date':new Date(),'user_email':email,'post_id':id,"feedback":'likes'})
      }else{
        if (post_feedback[0].feedback == 'likes'){
          this_post[0].likes -= 1
          
          await connection_database("feedback").where('user_email',email).where('post_id',id).delete()
          }
          if(post_feedback[0].feedback == 'dislike'){
              this_post[0].dislike -= 1
              await connection_database("feedback").where('user_email',email).where('post_id',id).where('feedback','dislike').delete()
          }
      }
      await connection_database('posts_data').where('email',post_email).where('id',id).update(this_post[0])
      res.redirect("http://localhost:3000/home")

  } catch (error) {
  }
})

routers.get('/dislike/:id/:post_email/:update',async (req,res)=>{
  try {
      let {id,post_email,update} = req.params;
      id = id.slice(1)
      post_email = post_email.slice(1)
      update = update.slice(1)
      let {email} = await JSON.parse(fs.readFileSync('login.json'))

      let this_post =  await connection_database('posts_data').where('email',post_email).where('id',id)
      let post_feedback = await connection_database("feedback").where('user_email',email).where('post_id',id)

      if (!post_feedback.length){
          this_post[0].dislike += 1
          await connection_database("feedback").insert({'date':new Date(),'user_email':email,'post_id':id,"feedback":'dislike'})
      
      }else{
          if (post_feedback[0].feedback == 'dislike'){
              this_post[0].dislike -= 1
              await connection_database("feedback").where('user_email',email).where('post_id',id).delete()
          }
          if(post_feedback[0].feedback == 'likes'){
              this_post[0].likes -= 1
              await connection_database("feedback").where('user_email',email).where('post_id',id).where('feedback','likes').delete()
          }
      }
      await connection_database('posts_data').where('email',post_email).where('id',id).update(this_post[0])
      res.redirect("http://localhost:3000/home");

  } catch (error) {
  }
})

routers
  .route("/new_post")
  .get((req, res) => {
    res.render("new_post");
  })
  .post( async (req, res) => {
    const data = JSON.parse(fs.readFileSync("./login.json"));
    req.body["email"] = data.email;
    req.body["date"] = new Date();
    req.body["likes"] = 0;
    req.body["dislike"] = 0;
    const bool = await connection_database("posts_data").insert(req.body);
    // res.json({ msg: "you posted new post!!!" });
    res.redirect("http://localhost:3000/home");
  });


routers.get('/comments/:id/:email',async(req,res)=>{
  var {id,email} = req.params
  id = id.slice(1)
  email = email.slice(1)
  const value =  await connection_database('posts_data').where('id',id)
  res.send(value)
})

routers.get('/delete/:id',async (req,res)=>{
  var {id} = req.params
    id = id.slice(1)
    const jsonD = await JSON.parse(fs.readFileSync('login.json'))
    email =  jsonD.email
  await connection_database('posts_data').where('id',id).where("email",email).delete()
  const r = await connection_database('feedback').where('post_id',id).delete()
  res.redirect('http://localhost:3000/profile')
})


module.exports = routers;
