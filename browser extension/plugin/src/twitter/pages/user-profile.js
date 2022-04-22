function getTimeline() {
    const ariaLabelString = `[aria-label="Timeline: ${document.title
        .split(' ')
        .slice(0, -3)
        .join(' ')}’s Tweets"]`;
    return document.querySelector(ariaLabelString).firstChild;
}

export default { getTimeline };
