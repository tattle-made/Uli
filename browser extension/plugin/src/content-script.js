import ReactDOM from "react-dom";
import { InlineButtons } from "./InlineButtons";
import { replaceSlur, updateSlurList } from "./slur-replace";
let currentTweetCount = 0;
import repository from "./repository";
const { getPreferenceData } = repository;
import chrome from "./chrome";

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

const processTweets = async function () {
  const userData = await repository.getUserData();
  const preferenceData = await repository.getPreferenceData();
  // console.log({ userData, preferenceData });
  spans = document.getElementsByClassName(
    "css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"
  );
  spans = Array.from(spans);
  if (spans.length != currentTweetCount) {
    console.log("replacing slur");
    currentTweetCount = spans.length;
    spans.map((span) => {
      text = span.innerText;
      span.innerText = replaceSlur(text);
    });
  }
};

async function initialize() {
  let main = document.getElementsByTagName("main")[0];
  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = "ogbv-inline-button";
  main.prepend(inlineButtonDiv);
  const app = document.getElementById("ogbv-inline-button");
  ReactDOM.render(
    <InlineButtons style={{ position: "sticky", top: 0 }} node={main} />,
    app
  );

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }

  const observer = new MutationObserver(processTweets);
  const bodyNode = document.getElementsByTagName("body")[0];
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(bodyNode, config);
}

chrome.addListener(
  "updateData",
  async () => {
    console.log("data changed. time to update slurs");
    const preference = await getPreferenceData();
    console.log(preference);
    if (preference.slurList != undefined) {
      updateSlurList(preference.slurList);
      processTweets();
    }
  },
  "done"
);

// setTimeout(() => {
//   initialize();
// }, 5000);

// setTimeout(() => {
//   const observer = new MutationObserver(processTweets);
//   observer.observe(bodyNode, config);

//   let main = document.getElementsByTagName("main")[0];
//   var inlineButtonDiv = document.createElement("div");
//   inlineButtonDiv.id = "ogbv-inline-button";
//   main.prepend(inlineButtonDiv);
//   const app = document.getElementById("ogbv-inline-button");
//   ReactDOM.render(
//     <InlineButtons style={{ position: "sticky", top: 0 }} node={main} />,
//     app
//   );
// }, 5000);

// let main = document.getElementsByTagName("main")[0];
// var inlineButtonDiv = document.createElement("div");
// inlineButtonDiv.id = "ogbv-inline-button";
// main.prepend(inlineButtonDiv);
// const app = document.getElementById("ogbv-inline-button");
// ReactDOM.render(<InlineButtons node={main} />, app);
