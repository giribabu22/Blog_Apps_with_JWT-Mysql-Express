const connection_database = require("../db/data");
const express = require('express')
const routers = express.Router()

routers.get('/:post_id', async (req, res) => {
    await connection_database('comments').where("id",req.params.post_id.slice(1)).delete()
    res.redirect(`http://localhost:3000/comments/:${req.params.post_id.slice(1)}/data`);
})

module.exports = routers
