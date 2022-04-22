import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

export function saveScreenshot(element) {
  try {
    return domtoimage
      .toBlob(element.lastChild, { bgcolor: "white" })
      .then(async function (blob) {
        let fileName;

        fileName = new Date().toTimeString().split(" ").join("_");

        saveAs(blob, `ogbv_plugin_tweet_${fileName}.png`);
      });
  } catch (err) {
    console.log("Could not save Image", err);
  }
}
