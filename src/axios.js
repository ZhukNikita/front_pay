import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';


export const API_URL = `https://www.global-payment-solutions.com:8080`;

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL
})
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${secureLocalStorage.getItem('userToken')}`
    return config;
})
export default $api;