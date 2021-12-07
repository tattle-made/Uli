import axios from "axios";
import { config } from "../components/config";
import {
	getUser,
	saveUserinLS,
	savePreferenceinLS,
	saveUserSessionInLS,
} from "../repository/user";

async function login(username, password) {
	return getUser(username, password);
}

async function logout(username, password) {}

async function saveUserInLocalStorage(user) {
	return saveUserinLS(user);
}

async function saveUserSessionInLocalStorage(session) {
	return saveUserSessionInLS(session);
}

async function saveUserPreferenceInLocalStorage(userPreference) {
	return savePreferenceinLS(userPreference);
}
export {
	login,
	logout,
	saveUserInLocalStorage,
	saveUserPreferenceInLocalStorage,
	saveUserSessionInLocalStorage,
};
