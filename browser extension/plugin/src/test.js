var input = {
  tagName: "DIV",
  childNodes: [
    {
      tagName: "DIV",
      childNodes: [
        {
          tagName: "DIV",
          childNodes: [
            {
              tagName: "IMAGE",
              childNodes: [],
            },
          ],
        },
      ],
    },
    {
      tagName: "DIV",
      childNodes: [
        {
          tagName: "DIV",
          childNodes: [
            {
              tagName: "SPAN",
              childNodes: [],
            },
          ],
        },
      ],
    },
    {
      tagName: "DIV",
      childNodes: [
        {
          tagName: "IMAGE",
          childNodes: [],
        },
      ],
    },
  ],
};

TWEET_PATH = "";
TWEET_TIME =
  "DIV:DIV:DIV:DIV:ARTICLE:DIV:DIV:DIV:DIV:DIV:DIV:DIV:DIV:DIV:A:TIME";

const TWEET_SPAN_PATH =
  "DIV:DIV:DIV:DIV:ARTICLE:DIV:DIV:DIV:DIV:DIV:DIV:DIV:DIV:SPAN";

function DFT(node, currentPath, shouldContinue) {
  //   console.log(currentPath);

  if (!shouldContinue) {
    return;
  }
  let elementTag = node.tagName;
  if (elementTag == undefined) {
    elementTag = "UND";
  }
  const newCurrentPath = currentPath + ":" + elementTag;
  node.childNodes.forEach((a) => {
    // if (TWEET_SPAN_PATH.startsWith(newCurrentPath)) {
    //   shouldContinue = true;
    // } else {
    //   shouldContinue = false;
    // }
    DFT(a, newCurrentPath, true);
  });
  if (
    node.childNodes.length === 0 &&
    (elementTag === "SPAN" || elementTag === "A" || elementTag === "UND")
  ) {
    console.log("Found Relevant Leaf ", currentPath);
    console.log(node);
    //  if (currentPath === TWEET_SPAN_PATH) {

    // }
  }
}

DFT(input, "DIV", true);
