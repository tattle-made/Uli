//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const { register } = require("../controllers/auth");


router.get("/auth/register", register);


module.exports = router ; 