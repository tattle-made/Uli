//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router();


const { addPreference, getPreference } = require("../controllers/preference");


router.get("/preference/", getPreference);
router.post("/preference/", addPreference);



module.exports = router ; 