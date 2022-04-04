import ReactDOM from "react-dom";
import { Box, Text } from "grommet";
import { InlineButtons } from "./ui-components/pages/InlineButtons";
import { replaceSlur, updateSlurList } from "./slur-replace";
import { dom } from "./twitter";
import repository from "./repository";
import { TweetControl } from "./twitter/tweet-controls";
const { getPreferenceData } = repository;
const {
  createTopBannerElement,
  getTopBannerElement,
  setTimelineChangeListener,
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

  const node = getTopBannerElement();

  ReactDOM.render(
    <InlineButtons style={{ position: "sticky", top: 0 }} node={node} />,
    node
  );

  const preference = await getPreferenceData();

  if (preference != undefined && preference.slurList != undefined) {
    updateSlurList(preference.slurList);
  }
  setTimelineChangeListener();
}
