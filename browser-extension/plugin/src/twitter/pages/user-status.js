function getTimeline() {
    return document.querySelector('[aria-label="Timeline: Conversation"]')
        .firstChild;
}

export default { getTimeline };
