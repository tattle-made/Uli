import ReactDOM from "react-dom";
import { App } from "./App";

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {
//     alert(response);
//   });
// });

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
