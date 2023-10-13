const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function registerNewUser() {
    return axios.get(`${API_URL}/auth/register`);
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
    createSlurAndCategory,
    updateSlurAndCategory,
    deleteSlurAndCategory, 
    getSlurAndCategory
};
