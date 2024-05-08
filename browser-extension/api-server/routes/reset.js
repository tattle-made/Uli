//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const { resetUser } = require("../controller-auth");
const { resetAccount } = require("../controllers/reset");



router.post("/reset", resetAccount);

module.exports = router ; 