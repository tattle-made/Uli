
/*           getAllTextNodes()  STARTS HERE        */

function checkFalseTextNode(text, actualLengthOfText) {
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n" || text[i] === " " || text[i] === "\t") {
            // I think not only \n and " " , if a textNode is comprised of any escape characters and whitespace, it should be a false textNode
            totalNewlineAndWhitespaces++;
        }
    }
    return totalNewlineAndWhitespaces === actualLengthOfText;
}


// Function to recursively get all text nodes under a given node
function getAllTextNodes(node, uliStore) {
    if (node.nodeType === 3) { // Text node
        if (!checkFalseTextNode(node.data, node.length)) {
            uliStore.push({ node: node, parent: node.parentNode });
        }
    } else {
        let children = Array.from(node.childNodes);
        children.forEach(child => getAllTextNodes(child, uliStore));
    }
}



/*                getAllTextNodes()  ENDS HERE                */


/*                 locateSlur()  STARTS HERE                  */

function findPositions(word, text) {
    let positions = {};

    let len = word.length
    let loc = []
    let index = text.toString().indexOf(word);
    while (index !== -1) {
        let obj = {};
        loc.push([index, index + len]);
        index = text.toString().indexOf(word, index + 1);
    }


    if (loc.length !== 0) {
        positions.slurText = word
        positions.slurLocation = loc;
    }
    return positions;
}



function locateSlur(uliStore, targetWords) {
    let n = uliStore.length;

    for (let i = 0; i < n; i++) {
        let store = uliStore[i];  //This will contain the textNode 
        let parentNode = store.parent
        let textnode = store.node
        let text = store.node.textContent
        let tempParent = document.createElement("span");  //I chose span over p because span is an inline element and p is a block element, injecting block
        //element would cause a lot of change in the stylings and can damage the overall webpage to a greater extent
        tempParent.textContent = text;

        let slurs = [];
        let slurPresentInTempParent = false;
        targetWords.forEach(targetWord => {
            let slurWord = targetWord;
            let pos = findPositions(slurWord, text);
            if (Object.keys(pos).length !== 0) {
                slurs.push(pos)
            }

            if (tempParent.innerHTML.includes(targetWord)) {
                const className = `icon-container-${targetWord}`;
                const parts = tempParent.innerHTML.split(targetWord);
                const replacedHTML = parts.join(`${targetWord}<span class="${className}"></span>`);
                tempParent.innerHTML = replacedHTML
                slurPresentInTempParent = true;
            }
        })
        // for(let i = 0 ; i < )
        // console.log("tempParent " , tempParent)
        uliStore[i].nodeToParent = tempParent
        uliStore[i].slurs = slurs;

        //O(1) complexity
        if (slurPresentInTempParent) {
            // parentNode.replaceChild(tempParent, textnode)
            textnode.replaceWith(tempParent)
            // textnode.replaceWith(createTextNode(tempParent.innerHTML))

        }

    }
    return uliStore;
}


/*                    locateSlur()  ENDS HERE               */




/*                        addMetaData()  STARTS HERE           */

function addMetaData(targetWords) {
    targetWords.forEach(targetWord => {
        const className = `icon-container-${targetWord}`
        const elements = Array.from(document.querySelectorAll(`.${className}`))
        elements.forEach(element => {

            let sup = document.createElement("sup");

            let img = document.createElement("img");
            img.style.height = "2%"
            img.style.width = "2%"
            img.style.cursor = "pointer"
            img.src = "https://upload.wikimedia.org/wikipedia/commons/4/43/Minimalist_info_Icon.png"
            // img.src = "./info.png"
            img.alt = "altText"

            let span = document.createElement("span")
            // span.style.all = "unset"
            span.style.display = "none"
            span.style.position = "absolute"
            span.style.backgroundColor = "antiquewhite"
            span.style.border = "1px solid black"
            span.style.borderRadius = "12px"
            span.style.padding = "2px 6px"
            // span.style.width = "12rem"
            span.style.textAlign = "justify"
            span.style.fontWeight = "lighter"
            span.style.color = "black"
            span.style.zIndex = "1000000000"; // This ensures it appears above other elements
            span.style.fontSize = "14px"
            span.style.textDecoration = "none"
            span.style.fontStyle = "normal"
            // span.style.height = "fit-content"
            span.innerHTML = `This is ${targetWord}`

            // span.style.display = "none";
            // span.style.position = "absolute";
            // span.style.backgroundColor = "antiquewhite !important";
            // span.style.border = "1px solid black !important";
            // span.style.borderRadius = "12px !important";
            // span.style.padding = "2px 6px !important";
            // span.style.width = "12rem !important";
            // span.style.textAlign = "justify !important";
            // span.innerHTML = `This is ${targetWord}`;




            if (targetWord.toLowerCase() === "crazy") {
                span.innerHTML = `It can perpetuate stereotypes about mental health and may be hurtful to those with mental health conditions.`
            }
            else if (targetWord.toLowerCase() === "mad") {
                span.innerHTML = `Using "mad" to describe someone negatively can be insensitive.`
            }
            else if (targetWord.toLowerCase() === 'stupid') {
                span.innerHTML = `Describing actions or decisions as "stupid" can be demeaning and hurtful.`
            }
            else {
                span.innerHTML = `This word is considered offensive.`
            }


            sup.appendChild(img)
            sup.appendChild(span)

            element.append(sup)
            let sups = element.children[0]
            let spans = element.children[0].children[1]
            const svgs = element.children[0].children[0];
            svgs.addEventListener('mouseover', function () {
                sups.children[1].style.display = "inline-block"
                // sups.children[1].style.display = "block"
            });

            svgs.addEventListener('mouseout', function () {
                sups.children[1].style.display = "none"
            });
        })
    })
}


/*                      addMetaData() ENDS HERE                  */



module.exports = { addMetaData, locateSlur, findPositions, getAllTextNodes, checkFalseTextNode }