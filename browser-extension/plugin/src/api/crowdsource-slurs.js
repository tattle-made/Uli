import axios from 'axios';
import config from '../config';

const { API_URL } = config;

export async function createCrowdsourceSlur(attrs, authToken) {
    try {
        const res = await axios.post(`${API_URL}/api/slurs`, attrs, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return res.data;
    } catch (err) {
        throw err;
    }
}

export async function getCrowdsourceSlurs(authToken) {
    try {
        const res = await axios.get(`${API_URL}/api/slurs`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        return res.data.slurs;
    } catch (error) {
        throw error;
    }
}

export async function getCrowdsourceSlurById(id, authToken) {
    try {
        const result = await axios.get(`${API_URL}/api/slurs/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return result.data.slur;
    } catch (err) {
        throw err;
    }
}


export async function updateCrowdsourceSlur(slurId, updatedData, authToken) {
    
    try {
        await axios.put(`${API_URL}/api/slurs/${slurId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
    
        
    } catch (error) {
        throw error
    }
}

export async function deleteCrowdsourceSlur(slurId, authToken) {

    try {
        const res = await axios.delete(`${API_URL}/api/slurs/${slurId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        return res.data.deleted_slur;
        
    } catch (error) {
        throw error
    }
    
}