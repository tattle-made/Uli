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

async function initialize() {
  createTopBannerElement();

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }

  // processExistingNodes();
  setTimelineChangeListener();
}
