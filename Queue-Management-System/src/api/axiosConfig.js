import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/food_queue/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;