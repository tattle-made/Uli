const axios = require('axios');

const API_URL = 'http://localhost:3000';

/**
 * TODO: Currently not added from Api.js 
 * - login()
 * - getPreferenceForUser() - not used anywhere
 * - uploadArchivedMedia()
 * - getArchive()
 * - invokeNetwork()
*/

async function registerNewUser() {
    return axios.get(`${API_URL}/auth/register`);
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

async function createSlurAndCategory(accessToken, slurData) {
    return axios.post(`${API_URL}/slur/create`, slurData, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
}

async function updateSlurAndCategory(accessToken, slurId, updatedData) {
    return axios.put(`${API_URL}/slur/${slurId}`, updatedData, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
}

async function deleteSlurAndCategory(accessToken, slurId) {
    return axios.delete(`${API_URL}/slur/${slurId}`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
}

async function getSlurAndCategory(accessToken) {
    const result = await axios.get(`${API_URL}/slur`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    return result.data;
}

module.exports = {
    registerNewUser,
    getPreferenceForUser,
    savePreference,
    resetAccount,
    createSlurAndCategory,
    updateSlurAndCategory,
    deleteSlurAndCategory, 
    getSlurAndCategory
};
