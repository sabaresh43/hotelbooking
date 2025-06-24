import api from '../features/interceptor';
const FIND_ALL_USERS = '/user/findAllUsers';
// const GET_USER_COUNT = '/document/countDocuments/users';

export async function findAllUsers() {
    //console.log('findAllUsers called');
    try {
        const response = await api.get(FIND_ALL_USERS);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching user data:', error);
    }
}

export async function findUserById(userId) {
    //console.log('findUserById called: ', userId);
    try {
        const response = await api.get(`/user/findUserById/${userId}`);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching user data:', error);
    }
}

export async function findUserByEmail(userEmail) {
    //console.log('findUserByEmail called: ', userEmail);
    try {
        const response = await api.get(`/user/findUserByEmail/${userEmail}`);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching user data:', error);
    }
}

// export async function getUserCount() {
//     //console.log('getUserCount called');
//     try {
//         const response = await api.get(GET_USER_COUNT);
//         const responseJson = await response.data;
//         //console.log('responseJson', responseJson);
//         return responseJson.count;
//     } catch (error) {
//         console.error('Error during fetching user data:', error);
//     }
// }


export async function updateUser(userId, newData) {
    //console.log('updateUser called: ', userId);
    const newUserData = JSON.stringify({
        ...newData
    });

    try {
        const response = await api.put(`/user/updateUser/${userId}`, newUserData);
        await response.data;
        return true; // update successfully
    } catch (error) {
        console.error('Error during updating user data:', error);
        return false; // error occurred
    }
}

export async function deleteUser(userId) {
    //console.log('deleteUser called: ', userId);
    try {
        await api.delete(`/user/deleteUser/${userId}`);
        return true;
    } catch (error) {
        console.error('Error during deleting user data:', error);
        return false; // error occurred
    }
}