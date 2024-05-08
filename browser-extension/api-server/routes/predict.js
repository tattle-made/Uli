//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const {predict} = require("../controllers/predict") ;


router.post("/predict", predict);



module.exports = router ; 