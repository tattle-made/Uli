const timelineLabels = {
  HOME: '[aria-label="Timeline: Your Home Timeline"]',
  USER: `[aria-label="Timeline: ${document.title
    .split(" ")
    .slice(0, -3)
    .join(" ")}’s Tweets"]`,
  STATUS: '[aria-label="Timeline: Conversation"]',
};

function getTimelineElement(location) {
  const userTimelineRegex = new RegExp("");
  const homeRegex = new RegExp("");
  const statusRegex = new RegExp("");

  let label;

  if (userTimelineRegex.test(location)) {
    label = timelineLabels[timelineLabels.USER];
  } else if (homeRegex.test(location)) {
    label = timelineLabels[timelineLabels.HOME];
  } else if (statusRegex.test(location)) {
    label = timelineLabels[timelineLabels.STATUS];
  } else {
    label = timelineLabels[timelineLabels.STATUS];
  }

  const timeline = document.querySelector(
    '[aria-label="Timeline: Your Home Timeline"]'
  ).firstChild;

  return timeline;
}

export default {
  getTimelineElement,
};
