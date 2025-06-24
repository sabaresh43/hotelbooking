import api from '../features/interceptor';
const FIND_ALL_HOTELS = '/hotel/findAllHotels';
//const GET_HOTEL_COUNT = '/document/countDocuments/hotels';

export async function findAllHotels() {
 console.log("api base url:" + api.defaults.baseURL);
    //console.log('findAllHotels called');
    try {
        const response = await api.get(FIND_ALL_HOTELS);
        console.log("api base url:" + api.defaults.baseURL);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching hotel data:', error);
    }
}

export async function findHotelById(hotelId) {
    //console.log('findHotelById called: ', hotelId);
    try {
        const response = await api.get(`/hotel/findHotelById/${hotelId}`);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching hotel data:', error);
    }
}

// export async function getHotelCount() {
//     //console.log('getHotelCount called');
//     try {
//         const response = await api.get(GET_HOTEL_COUNT);
//         const responseJson = await response.data;
//         //console.log('responseJson', responseJson);
//         return responseJson.count;
//     } catch (error) {
//         console.error('Error during fetching hotel data:', error);
//     }
// }

export async function updateHotel(hotelId, newData) {
    //console.log('updateHotel called: ', hotelId);
    const newHotelData = JSON.stringify({
        ...newData
    });
    try {
        const response = await api.put(`/hotel/updateHotel/${hotelId}`, newHotelData);
        await response.data;
        return true; // update successfully
    } catch (error) {
        console.error('Error during updating hotel data:', error);
        return false; // error occurred
    }
}

export async function getUserBookedHotels(userId) {
    //console.log('getUserBookedHotels called: ', userId);
    try {
        const response = await api.get(`/hotel/getUserBookedHotels/${userId}`);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching hotel data:', error);
    }
}