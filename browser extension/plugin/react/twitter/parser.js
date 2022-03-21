/**
 * Path to all DOM elements related to parsing tweets.
 */
const TWEET_LANGUAGE =
  "div > div > div > div > div > article > div > div > div:nth-child(1) >  div:nth-child(2) >  div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child";
const TWEET_URL =
  "div > div > div > div > div > article > div > div > div:nth-child(1) >  div:nth-child(2) >  div:nth-child(2) >  div:nth-child(1) >  div:nth-child(1) >  div:nth-child(1) > div:nth-child(1) > a";
const INLNE_OPTIONS_SPACE =
  "div > div > div > div > div > article > div > div > div:nth-child(1) >  div:nth-child(2) >  div:nth-child(2) >  div:nth-child(1) >  div:nth-child(1) >  div:nth-child(1)";
const TWEET_TEXT =
  "div > div > div > div > div > article > div > div > div:nth-child(1) >  div:nth-child(2) >  div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child > span";

/**
 * Returns a tweet object with structured access to all relevant tweet data
 * Throws an exception if the dom structure has changed.
 */
function getTweet(domElement) {}

export default {
  getTweet,
};
