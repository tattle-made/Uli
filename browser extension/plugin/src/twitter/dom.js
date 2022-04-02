import ReactDOM from "react-dom";
import { TweetControl } from "./tweet-controls";

/**
 * dom is responsible for
 * 1. Parsing the DOM and converting it into structured tweet objects
 * 2. DOM editing - adding divs, editing classes and attributes etc
 * 3. Registering event handlers
 */

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
          const tweet = parseAndMakeTweet(node);
          if (tweet) {
            var inlineButtonDiv = document.createElement("div");
            inlineButtonDiv.id = id;
            node.prepend(inlineButtonDiv);
            // tweets[id] = getTweet(node);

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
 * Parses the DOM and extracts structured data from it.
 * @param {DOMElement obtained from document.getElementById query} tweetDom
 * @return {Object} Tweet - stuctured tweet with values extracted from the dom
 */
function parseAndMakeTweet(tweetDom) {
  const TWEET_PATH_GENERAL = new RegExp(
    "DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(1\\):DIV\\(1\\):DIV\\(1\\):DIV\\([0-9]+\\):DIV\\(0\\):DIV\\([0-9]+\\):DIV\\([0-9]+\\):DIV\\(0\\):SPAN"
  );
  let leaves = {};

  function getId() {
    const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
    return id;
  }

  function DFT(node, currentPath) {
    let elementTag = node.tagName;
    if (elementTag == undefined) {
      elementTag = "UND";
    }
    node.childNodes.forEach((a, ix) => {
      const newCurrentPath = currentPath + `(${ix})` + ":" + elementTag;
      DFT(a, newCurrentPath);
    });
    if (
      node.childNodes.length === 0 &&
      (elementTag === "SPAN" || elementTag === "A" || elementTag === "UND")
    ) {
      console.log({ currentPath, node });
      if (TWEET_PATH_GENERAL.test(currentPath)) {
        const id = getId();
        const parentElement = node.parentElement;
        parentElement.setAttribute("id", id);
        leaves[id] = parentElement;
      }
    }
  }

  DFT(tweetDom, "DIV");

  return leaves;
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
  tweets,
};
