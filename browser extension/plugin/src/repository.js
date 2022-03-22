import chrome from "./chrome";
import config from "./config";
const { get, set } = chrome;

const dataUserKey = `${config.LOCAL_STORAGE_NAME + "User"}`;
const dataPreferenceKey = `${config.LOCAL_STORAGE_NAME + "Preference"}`;

/**
 * This is an idempotent function and can be safely called during app
 * startup to ensure that the Local Storage is in an expected state.
 */
async function initialize() {
  const dataUser = await get(dataUserKey);
  if (dataUser === undefined) {
    await set(dataUserKey, {});
  }

  const dataPreference = await get(dataPreferenceKey);
  if (dataPreference === undefined) {
    await set(dataPreferenceKey, {});
  }
}

async function getUserData() {
  const dataUser = await get(dataUserKey);
  return dataUser;
}

async function setUserData(data) {
  await set(dataUserKey, data);
}

async function getPreferenceData() {
  const dataPreference = await get(dataPreferenceKey);
  return dataPreference;
}

async function setPreferenceData(data) {
  await set(dataPreferenceKey, data);
}

export default {
  initialize,
  getUserData,
  setUserData,
  getPreferenceData,
  setPreferenceData,
};
