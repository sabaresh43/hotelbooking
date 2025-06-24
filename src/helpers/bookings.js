import api from '../features/interceptor';
const FIND_ALL_BOOKINGS = '/booking/findAllBookings';
const CREATE_BOOKING = '/booking/createBooking';
//const GET_BOOKING_COUNT = '/document/countDocuments/bookings';

export async function findAllBookings() {

    //console.log('findAllBookings called');
    try {
        const response = await api.get(FIND_ALL_BOOKINGS);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching booking data:', error);
    }
}

export async function findBookingByUserId(userId) {

    //console.log('findBookingByUserId called: ', userId);
    try {
        const response = await api.get(`/booking/findBookingByUserId/${userId}`);
        const responseJson = await response.data;
        //console.log('responseJson', responseJson);
        return responseJson.data;
    } catch (error) {
        console.error('Error during fetching booking data:', error);
    }
}

export async function createBooking(bookingData) {
    //console.log('createBooking called: ', bookingData);
    const data = JSON.stringify({
        ...bookingData
    });

    try {
        const response = await api.post(CREATE_BOOKING, data);
        await response.data;
        return true; // Booking created successfully
    } catch (error) {
        console.error('Error during creating booking:', error);
        return false; // Error occurred
    }
}

// export async function getBookingCount() {
//     //console.log('getBookingCount called');
//     try {
//         const response = await fetch(GET_BOOKING_COUNT);
//         const responseJson = await response.data;
//         //console.log('responseJson', responseJson);
//         return responseJson.count;
//     } catch (error) {
//         console.error('Error during fetching hotel data:', error);
//     }
// }