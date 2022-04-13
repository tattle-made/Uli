import { updateSlurList } from "./slur-replace";
import { dom } from "./twitter";
import repository from "./repository";
const { getPreferenceData } = repository;
const {
  createTopBannerElement,
  setTimelineChangeListener,
  processExistingNodes,
} = dom;

console.log("TEST : CS loaded");

if (process.env.ENVIRONMENT) {
  console.log("Content Script Loaded");
}

setTimeout(async () => {
  await initialize();
}, 5000);

const processTweets = async function () {
  // const userData = await repository.getUserData();
  // const preferenceData = await repository.getPreferenceData();
  // console.log({ userData, preferenceData });
  var spans = document.getElementsByClassName(
    "css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"
  );
  spans = Array.from(spans);
  if (spans.length != currentTweetCount) {
    console.log("replacing slur");
    currentTweetCount = spans.length;
    spans.map((span) => {
      const text = span.innerText;
      span.innerText = replaceSlur(text);
    });
  }
};

async function initialize() {
  createTopBannerElement();

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }

  // processExistingNodes();
  setTimelineChangeListener();
}
