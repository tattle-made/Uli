import ReactDOM from "react-dom";
import { TweetControl } from "./tweet-controls";

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

function createTopBannerElement() {
  let main = document.getElementsByTagName("main")[0];
  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = "ogbv-inline-button";
  main.prepend(inlineButtonDiv);
}

function getTopBannerElement() {
  return document.getElementById("ogbv-inline-button");
}

function addInlineMenu(item) {
  const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;

  item.setAttribute("id", id);
  const tweet = getTweet(item);
  if (tweet) {
    var inlineButtonDiv = document.createElement("div");
    inlineButtonDiv.id = id;
    item.prepend(inlineButtonDiv);

    ReactDOM.render(<TweetControl id={id} />, inlineButtonDiv);
  }
}

const processTweets = async function (mutationsList, observer) {
  console.log("process tweets");
  // console.log(mutationsList);
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length != 0) {
        console.log("A child node has been added");
        const nodes = Array.from(mutation.addedNodes);
        nodes.map((node) => {
          const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
          console.log(id, node.innerText, node);
          node.setAttribute("id", id);
          const tweet = getTweet(node);
          if (tweet) {
            var inlineButtonDiv = document.createElement("div");
            inlineButtonDiv.id = id;
            node.prepend(inlineButtonDiv);

            ReactDOM.render(<TweetControl id={id} />, inlineButtonDiv);
          }
        });
      }
    } else if (mutation.type === "attributes") {
      // console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

function setTimelineChangeListener() {
  const observer = new MutationObserver(processTweets);
  const timeline = document.querySelector(
    '[aria-label="Timeline: Conversation"]'
  ).firstChild;
  console.log(timeline);
  const nodes = Array.from(timeline.children);
  console.log({ nodes });
  nodes.map((item) => {
    addInlineMenu(item);
  });
  const config = { attributes: true, childList: true, subtree: false };
  observer.observe(timeline, config);
}

/**
 * Returns a tweet object with structured access to all relevant tweet data
 * Throws an exception if the dom structure has changed.
 */
function getTweet(tweetDom) {
  try {
    const language = tweetDom
      .querySelector(TWEET_LANGUAGE)
      .getAttribute("lang");
    const tweetUrl = tweetDom.querySelector(TWEET_URL).getAttribute("href");
    const inlineActionIconsDiv = tweetDom.querySelector(INLNE_OPTIONS_SPACE);
    const text = tweetDom.querySelector(TWEET_TEXT).innerText;
    return {
      language,
      tweetUrl,
      inlineActionIconsDiv,
      text,
    };
  } catch (err) {
    console.log("Unexpected Structure", err);
    return undefined;
  }
}

/**
 * This is where the tweet text is replaced with plugin specific features.
 *
 */
function processTweet(tweetDom) {}

export default {
  getTweet,
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
};
