import api from '../features/interceptor';
const USER_LOGIN = '/user/login';
const USER_LOGOUT = '/user/logout';
const USER_REGISTER = '/user/register';

export async function userLogin(email, password) {
    //console.log('userLogin called: ', email);
    const loginData = JSON.stringify({ email: email, password: password });
    try {
        const response = await api.post(USER_LOGIN, loginData);
        if (response.status === 200) {
            const responseJson = await response.data;
            //console.log('responseJson', responseJson);
            return responseJson; // not sure
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// send logout request to server, delete the refresh token from the database
export async function userLogout() {
    try {
        const response = await api.post(USER_LOGOUT);
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return false; // error occurred
    }
}

export async function userRegister(email, password, role) {
    //console.log('userRegister called: ', email);
    const registrationData = JSON.stringify({ email: email, password: password, role: role, isActive: true });

    try {
        const response = await api.post(USER_REGISTER, registrationData);
        if (response.status === 200) {
            const responseJson = await response.data;
            //console.log('responseJson', responseJson);
            return responseJson; // not sure
        } else {
            throw new Error('Register failed');
        }
    } catch (error) {
        console.error('Error during register:', error);
    }
}