import axios from "axios";
import { config } from "../components/config";
import ls from "local-storage";

async function getUser(username, password) {
	return axios.post(`${config.api_endpoint}/login`, {
		username,
		password,
	});
}

async function saveUserinLS(user) {
	ls("user", user);
}

async function savePreferenceinLS(pref) {
	ls("preference", pref);
}

async function saveUserSessionInLS(session) {
	ls("session", session);
}

async function isLoggedIn() {
	// console.log(ls("user"));
	return ls("user") == null || ls("user") == undefined ? false : true;
}

async function getUserFromLS() {
	return ls("user");
}

async function getUserSessionFromLS() {
	return ls("session");
}

async function logoutUser() {
	return ls.set("user", null);
}

async function getUserStatus(userId) {
	const { data } = await axios.get(
		`${config.api_endpoint}/dashboard/for-user?userId=${userId}`
	);
	const { status } = data;
	return { status };
}

export {
	getUser,
	saveUserinLS,
	savePreferenceinLS,
	saveUserSessionInLS,
	isLoggedIn,
	getUserFromLS,
	logoutUser,
	getUserStatus,
	getUserSessionFromLS,
};
