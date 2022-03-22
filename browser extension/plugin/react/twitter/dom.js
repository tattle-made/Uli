/**
 * dom is responsible for
 * 1. Parsing the DOM and converting it into structured tweet objects
 * 2. DOM editing - adding divs, editing classes and attributes etc
 * 3. Registering event handlers
 */

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

function createTopBannerElement(document) {
  let main = document.getElementsByTagName("main")[0];
  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = "ogbv-inline-button";
  main.prepend(inlineButtonDiv);
}

function getTopBannerElement(document) {
  return document.getElementById("ogbv-inline-button");
}

function setTimelineChangeListener(onChange) {
  const observer = new MutationObserver(onChange);
  const timeline = document.querySelector(
    '[aria-label="Timeline: Conversation"]'
  ).firstChild;
  const config = { attributes: true, childList: true, subtree: false };
  observer.observe(timeline, config);
}

/**
 * Returns a tweet object with structured access to all relevant tweet data
 * Throws an exception if the dom structure has changed.
 */
function getTweet(tweetDom) {}

export default {
  getTweet,
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
};
