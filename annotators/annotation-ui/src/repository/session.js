import axios from "axios";
import { config } from "../components/config";

async function saveSession(userId, session) {
	return axios.post(
		`${config.api_endpoint}/session?userId=${userId}`,
		session
	);
}

export { saveSession };
