//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router() ;

const { upload } = require("../s3");


const {getArchive , archiveTweet} = require("../controllers/archive.js") ;



router.get("/archive", getArchive);
router.post("/archive", upload.single("screenshot"), archiveTweet);



module.exports = router ; 
