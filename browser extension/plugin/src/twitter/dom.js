import ReactDOM from "react-dom";
import { InlineButtons } from "../ui-components/pages/InlineButtons";
import { TweetControl } from "./tweet-controls";
import { getTimelineElement } from "./config";
import { parseTweet } from "./parser";

/**
 * dom is responsible for
 * 1. DOM editing - adding divs, editing classes and attributes etc
 * 2. Registering event handlers
 */

function createTopBannerElement() {
  console.log("TEST : Creating Top Banner");
  try {
    let main = document.getElementsByTagName("main")[0];
    var inlineButtonDiv = document.createElement("div");
    inlineButtonDiv.id = "ogbv-inline-button";
    main.prepend(inlineButtonDiv);
    ReactDOM.render(
      <InlineButtons style={{ position: "sticky", top: 0 }} />,
      inlineButtonDiv
    );
  } catch (err) {
    console.log("TEST : Error Creating Top Banner", err);
  }
}

function getTopBannerElement() {
  return document.getElementById("ogbv-inline-button");
}

function addInlineMenu(item) {
  const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
  item.setAttribute("id", id);

  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = id;
  item.prepend(inlineButtonDiv);

  ReactDOM.render(<TweetControl id={id} />, inlineButtonDiv);
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
          const tweet = parseTweet(node);
          if (tweet) {
            addInlineMenu(node);
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
  const timeline = getTimelineElement(location.href);

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
 * This is where the tweet text is replaced with plugin specific features.
 *
 */
function processTweet(tweetDom) {}

export default {
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
};
