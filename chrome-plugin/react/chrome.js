/**
 * The chrome object only available to the content script and the popup script in the context of an extension. This makes it inconvinient to develop this plugin because you have to reload the extension anytime you make a change to the extension.
 *
 * This object looks at the environment variable ENVIRONMENT and returns a mocked chrome object if ENVIRONMENT is "development". If it is production, it returns the actual chrome object. This way you can mock the return values to be whatever it is that you need it for the feature you are working on. This also lets you take advantage of the dev tools you are familiar with for developing React Apps.
 */
import config from "./config";

const ENVIRONMENT = config.ENVIRONMENT;

const storageMock = {
  local: {
    set: (object, callback) => {
      callback();
    },
    get: (arr, callback) => {
      callback({
        [`${config.LOCAL_STORAGE_NAME}User`]: {
          id: "9cf5b91c-6f65-4e0e-9263-0a63c05651e3",
          accessToken: "59a0c2f0-f42e-4823-98e6-7d9c0966b292",
        },
        [`${config.LOCAL_STORAGE_NAME}Preference`]: {
          language: "Tamil",
          friends: "denny@gmail.com,tarunima@yahoo.com",
          slurList: "cat,dog",
        },
      });

      // for uninitialized local storage
      // callback({
      //   [`${config.LOCAL_STORAGE_NAME}User`]: {},
      //   [`${config.LOCAL_STORAGE_NAME}Preference`]: {},
      // });
    },
  },
};

const storage = ENVIRONMENT === "production" ? chrome.storage : chrome.storage;
// const storage = ENVIRONMENT === "production" ? chrome.storage : storageMock;

/**
 * This promisifies the callback mechanism of the native chrome object.
 */
const get = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const set = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      storage.local.set({ [key]: value }, () => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

function sendMessage(type, payload) {
  if (type == "updateData") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "updateData" },
        function (response) {
          // alert(response);
        }
      );
    });
  }
}

function addListener(type, func, response) {
  chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    if (message.type === type) {
      func();
      sendResponse(response);
    }
  });
}

export default {
  get,
  set,
  sendMessage,
  addListener,
};
