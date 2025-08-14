import ky from 'ky';

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 30000,
});

export default api;
