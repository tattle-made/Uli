import axios from 'axios';
import config from '../../config';

const { API_URL } = config;

// change url from ${API_URL} to http://127.0.0.1:3000 for local dev

async function login(username, password) {
    const result = await axios.get(
        `${API_URL}/auth/login?username=${username}&password=${password}`
    );
    if (result.status === 200) {
        return result.data;
    } else {
        return null;
    }
}

async function getPreferenceForUser(accessToken) {
    const result = await axios.get(`${API_URL}/preference`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    return result.data.preference;
}

async function savePreference(accessToken, preference) {
    return axios.post(`${API_URL}/preference`, preference, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
}

// GET http://localhost:3000/preference
// Authorization: token e3be8fa9-7ec7-11ec-a714-0242ac140002

async function uploadArchivedMedia(accessToken, formData) {
    console.log('----3');
    console.log(`${API_URL}/archive`);
    console.log(formData);
    console.log({
        headers: {
            Authorization: `token ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    let response;
    try {
        response = await axios.post(`${API_URL}/archive`, formData, {
            headers: {
                Authorization: `token ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log({ response });
        return response;
    } catch (err) {
        console.log(err);
        throw 'Error : Could not upload archived media';
    }
}

async function registerNewUser() {
    return axios.get(`${API_URL}/auth/register`);
}

async function getArchive(accessToken) {
    const result = await axios.get(`${API_URL}/archive`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    return result.data.archive;
}

async function invokeNetwork(accessToken, message, url) {
    return axios.post(
        `${API_URL}/invoke-network`,
        { message, url },
        {
            headers: {
                Authorization: `token ${accessToken}`
            }
        }
    );
}

async function resetAccount(accessToken) {
    return axios.post(
        `${API_URL}/reset`,
        {},
        {
            headers: {
                Authorization: `token ${accessToken}`
            }
        }
    );
}

export default {
    login,
    getPreferenceForUser,
    savePreference,
    uploadArchivedMedia,
    invokeNetwork,
    registerNewUser,
    getArchive,
    resetAccount
};
