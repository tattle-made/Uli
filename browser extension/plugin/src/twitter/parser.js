/**
 * parser is responsible for
 * 1. Parsing the DOM and converting it into structured tweet objects
 */

/**
 * Parses the DOM and extracts structured data from it.
 * @param {DOMElement obtained from document.getElementById query} tweetDom
 * @return {Object} Tweet - stuctured tweet with values extracted from the dom
 */
function parseTweet(id, tweetDom) {
  const TWEET_PATH_GENERAL = new RegExp(
    "DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(1\\):DIV\\(1\\):DIV\\(1\\):DIV\\([0-9]+\\):DIV\\(0\\):DIV\\([0-9]+\\):DIV\\([0-9]+\\):DIV\\(0\\):SPAN"
  );
  let leaf = {
    id,
    original_text: [],
    spans: [],
  };

  function DFT(node, currentPath) {
    let elementTag = node.tagName;
    if (elementTag == undefined) {
      elementTag = "UND";
    }
    node.childNodes.forEach((a, ix) => {
      const newCurrentPath = currentPath + `(${ix})` + ":" + elementTag;
      DFT(a, newCurrentPath);
    });
    if (
      node.childNodes.length === 0 &&
      (elementTag === "SPAN" || elementTag === "A" || elementTag === "UND")
    ) {
      // console.log({ currentPath, node });
      if (TWEET_PATH_GENERAL.test(currentPath)) {
        const parentElement = node.parentElement;
        parentElement.setAttribute("id", id);
        leaf.original_text.push(parentElement.innerText);
        leaf.spans.push(parentElement);
        // leaves.push(parentElement);
        // console.log({ leaf: parentElement });
      }
    }
  }

  DFT(tweetDom, "DIV");
  console.log({ leaf });
  return leaf;
}

export { parseTweet };
