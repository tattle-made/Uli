import ReactDOM from "react-dom";
import { InlineButtons } from "../ui-components/pages/InlineButtons";
import { TweetControl } from "./tweet-controls";
import { getTimelineElement } from "./config";
import { parseTweet } from "./parser";
import { hashCode } from "./util";
import { replaceSlur } from "../slur-replace";

let tweets = {};

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

function debug(id) {
  console.log(tweets[id]);
  // unblur(id);
}

function unblur(id) {
  const tweetToUnBlur = tweets[id];
  for (var i = 0; i < tweetToUnBlur.spans.length; i++) {
    tweetToUnBlur.spans[i].innerText = tweetToUnBlur.original_text[i];
  }
}

function addInlineMenu(id, item) {
  // const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
  // const id = hashCode(item.innerHTML);

  item.setAttribute("id", id);

  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = id;
  item.prepend(inlineButtonDiv);

  ReactDOM.render(
    <TweetControl tweet={tweets[id]} id={id} debug={debug} unblur={unblur} />,
    inlineButtonDiv
  );
}

const processNodes = async function (mutationsList) {
  console.log("process tweets");
  // console.log(mutationsList);
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length != 0) {
        console.log("A child node has been added");
        const nodes = Array.from(mutation.addedNodes);
        nodes.map((node) => {
          const id = hashCode(node.innerHTML);
          tweets[id] = parseTweet(id, node);

          for (const tweet of tweets[id].spans) {
            // console.log({ 2: tweet });
            const text = tweet.innerText;
            tweet.innerText = replaceSlur(text);
          }

          addInlineMenu(id, node);
        });
      }
    } else if (mutation.type === "attributes") {
      // console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

function setTimelineChangeListener() {
  const observer = new MutationObserver(processNodes);
  const timeline = getTimelineElement(location.href);
  const config = { attributes: true, childList: true, subtree: false };
  observer.observe(timeline, config);
}

function processExistingNodes() {
  // add inline menu for already nodes
  const timeline = getTimelineElement(location.href);
  console.log(timeline);
  const nodes = Array.from(timeline.children);
  console.log({ nodes });
  nodes.map((item) => {
    addInlineMenu(item);
  });
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
  processExistingNodes,
  tweets,
};
