import axios from 'axios';
import config from '../config';

const { API_URL } = config;

export async function getPublicSlurs() {
    try {
        const res = await axios.get(`${API_URL}/api/dataset/slur/1`);
        
        return res.data.slurs;
    } catch (error) {
        throw error;
    }
}

export async function getPublicSlursMetadata() {
    try {
        const res = await axios.get(`${API_URL}/api/dataset/slurmetadata/1`);

        return res.data.slurs;
    } catch (error) {
        throw error;
    }
}