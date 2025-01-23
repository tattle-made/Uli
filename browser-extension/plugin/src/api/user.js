import axios from "axios";
import config from "../config";

const { API_URL } = config;

export async function userLogin({email, password}){

    console.log("INSIDE USERLOGIN: ")
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        console.log("RESPONSE IS: ",response)
        console.log('Login successful:', response.data);
        return response.data; 
    } catch (error) {
        
        throw error;
    }
}
