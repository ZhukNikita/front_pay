import axios from 'axios'
import secureLocalStorage from 'react-secure-storage';

const $api = axios.create({
    withCredentials:true,
    baseURL: 'http://localhost:5000'
})

$api.interceptors.response.use((config)=>{
    return config
},async (error)=>{
    const originalRequest = error.config
        try {
            const id = secureLocalStorage.getItem('userId');

            const response = await axios.get(`'http://localhost:5000'/getMe` , {id})
            secureLocalStorage.setItem('userId', response.data.id);
            secureLocalStorage.setItem('methods', response.data.methods);
            return $api.request(originalRequest  )
        }
        catch (e) {
            console.log(e)
        }
})
