import ReactDOM from "react-dom";
import { Box, Text } from "grommet";
import { InlineButtons } from "./ui-components/pages/InlineButtons";
import { replaceSlur, updateSlurList } from "./slur-replace";
import { dom } from "./twitter";
import repository from "./repository";
import { TweetControl } from "./twitter/tweet-controls";
const { getPreferenceData } = repository;

console.log("hi 2");

const {
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
  getTweet,
} = dom;

setTimeout(async () => {
  await initialize();
}, 3000);

const processTweets = async function (mutationsList, observer) {
  console.log("process tweets");
  // console.log(mutationsList);
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length != 0) {
        console.log("A child node has been added");
        // console.log(mutation.addedNodes[0]);

        // console.log(typeof mutation);
        const nodes = Array.from(mutation.addedNodes);
        nodes.map((node) => {
          const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
          console.log(id, node.innerText, node);
          node.setAttribute("id", id);
          const tweet = getTweet(node);
          if (tweet) {
            // console.log(tweet);

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
