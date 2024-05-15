//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const { getPost } = require("../controllers/post");


router.get("/post", getPost);


module.exports = router ; 
