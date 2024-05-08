//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const { addFeedback } = require("../controllers/feedback");


router.post("/feedback", addFeedback);


module.exports = router  ; 