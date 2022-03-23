import ReactDOM from "react-dom";
import { Box, Text } from "grommet";
import { InlineButtons } from "./InlineButtons";
import { replaceSlur, updateSlurList } from "./slur-replace";
import { dom } from "./twitter";
let currentTweetCount = 0;
import repository from "./repository";
const { getPreferenceData } = repository;
import chrome from "./chrome";

const {
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
} = dom;

/**
 * This script is injected into the website when the extension loads. It is responsible for injecting
 * the extension's UI elements and setting up listeners for DOM events.
 */

const TestComponent = () => (
  <Box round border>
    <Text>Hello</Text>
  </Box>
);

// console.log("Content Script Loaded Again");
// if (document.readyState === "loading") {
//   // document.addEventListener("DOMContentLoaded", initialize);
//   document.addEventListener("DOMContentLoaded", () => {
//     console.log(" ---- 1");
//   });
// } else {
//   console.log(" ---- 2");
//   // initialize();
//   let main = document.getElementsByTagName("article")[0];
//   console.log(main);
// }

setTimeout(async () => {
  await initialize();
}, 3000);

const processTweets = async function (mutationsList, observer) {
  console.log("process tweets");
  // console.log(mutationsList);
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
      console.log(mutation);

      // console.log(typeof mutation);
      const nodes = Array.from(mutation.addedNodes);
      nodes.map((node) => {
        const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
        console.log(id, node.innerText);
        node.setAttribute("id", id);
        // ReactDOM.render(<TestComponent />, node);
      });
    } else if (mutation.type === "attributes") {
      // console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
  // const tweets = document.getElementsByTagName("article");

  // console.log("-----------------");
  // console.log(`found ${tweets.length} tweets`);
  // // console.log(spans);
  // console.log("-----------------");

  // const userData = await repository.getUserData();
  // const preferenceData = await repository.getPreferenceData();
  // // console.log({ userData, preferenceData });
  // spans = document.getElementsByClassName(
  //   "css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"
  // );
  // spans = Array.from(spans);
  // if (spans.length != currentTweetCount) {
  //   console.log("replacing slur");
  //   currentTweetCount = spans.length;
  //   spans.map((span) => {
  //     text = span.innerText;
  //     span.innerText = replaceSlur(text);
  //   });
  // }
};

async function initialize() {
  createTopBannerElement(document);
  const node = getTopBannerElement(document);

  ReactDOM.render(
    <InlineButtons style={{ position: "sticky", top: 0 }} node={node} />,
    node
  );

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }

  setTimelineChangeListener(processTweets);
}

// chrome.addListener(
//   "updateData",
//   async () => {
//     console.log("data changed. time to update slurs");
//     const preference = await getPreferenceData();
//     console.log(preference);
//     if (preference.slurList != undefined) {
//       updateSlurList(preference.slurList);
//       processTweets();
//     }
//   },
//   "done"
// );
