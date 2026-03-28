import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/food_queue/api', // URL ของ PHP API คุณ
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;