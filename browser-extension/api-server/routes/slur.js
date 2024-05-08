//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const router = express.Router() ;


const {getSlur , getSlurById , createSlur , updateSlur , deleteSlur } = require("../controllers/slur")


console.log(`Inside Slur : ${process.env.NODE_ENV}`);

// GET request for Slur and Category
router.get("/slur", getSlur);

// GET request for Slur and Category by slurId 
router.get("/slur/:id", getSlurById);

// POST request for slur and category
router.post("/slur/create", createSlur);

// PUT request for slur and category
router.put("/slur/:id", updateSlur);

// DELETE request for slur and category
router.delete("/slur/:id", deleteSlur);


module.exports = router ; 