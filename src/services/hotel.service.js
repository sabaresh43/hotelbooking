import api from './api.config';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const hotelService = {
    // Get all hotels
    getAllHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },

    // Search hotels with filters - will call external GoGlobal POST when configured
    searchHotels: async (options) => {
        // If GO_GLOBAL_URL is configured, POST to it using the payload shape provided
        if (BASE_URL) {
            const payload = {
                country: 'IN',
                cityCode: options.cityCode || options.location || '',
                fromDate: options.fromDate || options.from?.format('YYYY-MM-DD'),
                toDate: options.toDate || options.to?.format('YYYY-MM-DD'),
                sort: options.sort || 1,
                currency: options.currency || 'USD',
                occupancy: options.occupancy || [{ adults: options.numberOfGuest || 2, roomCount: 1 }]
            };
            console.log("payload", payload);


            const response = await api.post('/hotels/goglobal', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            // Assume the external API returns an array of hotels in response.data
            return response.data;
        }

        // Fallback to internal search endpoint
        const response = await api.get('/hotels/search', { params: options });
        return response.data;
    },

    // Get hotel by ID
    // Get hotel details by ID with search parameters
// Get hotel details by ID with search parameters
getHotelDetails: async (hotelId, searchOptions) => {
    if (BASE_URL) {
        const payload = {
            country: 'IN',
            fromDate: searchOptions.from || searchOptions.fromDate,
            toDate: searchOptions.to || searchOptions.toDate,
            sort: 1,
            currency: searchOptions.currency || 'USD',
            occupancy: searchOptions.occupancy || [{ 
                adults: searchOptions.numberOfGuest || 2, 
                roomCount: 1 
            }]
        };
        
        console.log("Hotel details payload:", payload);
        console.log("Hotel ID:", hotelId);
        
        // ✅ Correct endpoint with hotelId in the path
        const response = await api.post(`/hotels/goglobal/${hotelId}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log("Hotel details response:", response.data);
       return response.data?.data || response.data;
    }
},

bookHotel: async (bookingData) => {
        if (BASE_URL) {
            const payload = {
                roomCode: bookingData.roomCode,
                fromDate: bookingData.fromDate,
                toDate: bookingData.toDate,
                rooms: bookingData.rooms,
                currency: bookingData.currency || 'USD',
                country: bookingData.country || 'IN'
            };

            console.log("Booking API payload:", payload);

            const response = await api.post('/hotels/goglobal/booking', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Booking API response:", response.data);
            return response.data;
        }

        // Fallback to internal booking
        const response = await api.post('/bookings', bookingData);
        return response.data;
    }
};

export default hotelService;
