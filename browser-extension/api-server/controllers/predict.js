//console.log(`Environment : ${process.env.NODE_ENV}`);

const { classify } = require("../service-classifier");


const predict =  async (req, res) => {
  const { text } = req.body;
  try {
    const label = await classify(text);
    res.send(label);
  } catch (err) {
    console.log("Error : could not classify tweet");
    console.log(err);
    res.status(501).send("Could not label this tweet");
  }
};



module.exports = {predict} ; 