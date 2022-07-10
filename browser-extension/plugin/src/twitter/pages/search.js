function getTimeline() {
    return document.querySelector('[aria-label="Timeline: Search timeline"]')
        .firstChild;
}

export default { getTimeline };
