//console.log(`Environment : ${process.env.NODE_ENV}`);

const {
  feedback
} = require("../db/models");


const addFeedback =  async (req, res) => {
  console.log("POST feedback");
  try {
    const data = req.body;

    await feedback.create({
      userId: data.user_id,
      tweetText: data.tweet_text,
      sentiment: data.tweet_sentiment,
      confidence: data.tweet_confidence,
    });

    res.send({ msg: "Feedback Sent" });
  } catch (err) {
    //console.log(err);
    res.status(501).send({ msg: "Error sending feedback" });
  }
};



module.exports = {addFeedback}  ; 