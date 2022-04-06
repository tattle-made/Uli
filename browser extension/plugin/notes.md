Simple tweet : https://twitter.com/Vikramjit_S/status/1480067787791880195
Looks like all tweets are articles. which means replacing text within them should be easy.
is this assumption always correct?

class = css-1dbjc4n

useful dom functions
.childElementCount
.firstElementChild

# Measuring Performance Time

var startTime = performance.now();
spans.map((span) => {
text = span.innerText;
span.innerText = replaceSlur(text);
});
var endTime = performance.now();
console.log(`Time Taken : ${endTime - startTime} ms`);

# Location specific checks

console.log("location", location.href);
