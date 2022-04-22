function getTimeline() {
    return document.querySelector('[aria-label="Timeline: Your Home Timeline"]')
        .firstChild;
}

export default { getTimeline };
