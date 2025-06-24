import axios from 'axios';
import { store } from './store';
import { logout, login, setToken } from './authSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_DB_URL,
    withCredentials: false,
    headers: {
        "Content-type": "application/json"
    }
});

// attach access token when sending request
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        //console.log(config);
        return config;
    },
    error => Promise.reject(error)
)

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        // if access token expires, refresh
        if (error.response?.status === 401) {
            try {
                // Attempt to refresh the access token
                //console.log('Refreshing access token...');
                // use a new instance to avoid infinite loop, 
                // otherwise if refreshToken got 401 response, it will trigger the interceptor again
                // it will throw an error if the response is 4XX or 5XX
                const res = await axios.post('/user/refreshAccessToken', null, {
                    baseURL: process.env.REACT_APP_DB_URL,
                    withCredentials: true // only send cookies when refreshing token
                });
                const accessToken = await res.data.token;

                store.dispatch(setToken({
                    token: accessToken,
                    sessionKey: store.getState().auth.sessionKey
                }));

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                //console.log('Retrying original request with new access token: ', originalRequest);
                // Retry the original request with a new instance
                return axios(originalRequest, {
                    baseURL: process.env.REACT_APP_DB_URL,
                    //withCredentials: true
                });
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                store.dispatch(logout());
                await axios.post('/user/logout', null, {
                    baseURL: process.env.REACT_APP_DB_URL,
                    withCredentials: true
                });
                return Promise.reject(refreshError);
            }
        }
        // Handle other errors (e.g., 403 Forbidden)
        return Promise.reject(error);
    }
)

export default api;