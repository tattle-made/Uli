import axios from "axios";
import { config } from "../components/config";
import { getUser, saveUserinLS, savePreferenceinLS } from "../repository/user";

async function login(username, password) {
  return getUser(username, password);
}

async function logout(username, password) {}

async function saveUserInLocalStorage(user) {
  return saveUserinLS(user);
}

async function saveUserPreferenceInLocalStorage(userPreference) {
  return savePreferenceinLS(userPreference);
}
export {
  login,
  logout,
  saveUserInLocalStorage,
  saveUserPreferenceInLocalStorage,
};
