import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';


export const API_URL = `http://194.15.112.131:8080`;

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL
})
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${secureLocalStorage.getItem('userToken')}`
    return config;
})
export default $api;