import ReactDOM from "react-dom";
import { replaceSlur, updateSlurList } from "./slur-replace";
import { dom } from "./twitter";
import repository from "./repository";
import { TweetControl } from "./twitter/tweet-controls";
const { getPreferenceData } = repository;
const { createTopBannerElement, setTimelineChangeListener } = dom;

console.log("TEST : CS loaded");

if (process.env.ENVIRONMENT) {
  console.log("Content Script Loaded");
}

setTimeout(async () => {
  await initialize();
}, 5000);

async function initialize() {
  createTopBannerElement();

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }
  setTimelineChangeListener();
}
