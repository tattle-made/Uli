import ReactDOM from "react-dom";
import { InlineButtons } from "./InlineButtons";
import { replaceSlur } from "./slur-replace";
let currentTweetCount = 0;
import repository from "./repository";

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

setTimeout(() => {
  initialize();
}, 3000);

const processTweets = async function () {
  // console.log("processing tweets");
  const userData = await repository.getUserData();
  const preferenceData = await repository.getPreferenceData();
  // console.log({ userData, preferenceData });
  spans = document.getElementsByClassName(
    "css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"
  );
  spans = Array.from(spans);
  if (spans.length != currentTweetCount) {
    currentTweetCount = spans.length;
    spans.map((span) => {
      text = span.innerText;
      span.innerText = replaceSlur(text);
    });
  }
};

function initialize() {
  let main = document.getElementsByTagName("main")[0];
  var inlineButtonDiv = document.createElement("div");
  inlineButtonDiv.id = "ogbv-inline-button";
  main.prepend(inlineButtonDiv);
  const app = document.getElementById("ogbv-inline-button");
  ReactDOM.render(
    <InlineButtons style={{ position: "sticky", top: 0 }} node={main} />,
    app
  );

  const observer = new MutationObserver(processTweets);
  const bodyNode = document.getElementsByTagName("body")[0];
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(bodyNode, config);
}

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

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   switch (message.type) {
//     case "getText":
//       sendResponse("hello");
//       break;
//   }
// });

// let main = document.getElementsByTagName("main")[0];
// var inlineButtonDiv = document.createElement("div");
// inlineButtonDiv.id = "ogbv-inline-button";
// main.prepend(inlineButtonDiv);
// const app = document.getElementById("ogbv-inline-button");
// ReactDOM.render(<InlineButtons node={main} />, app);
