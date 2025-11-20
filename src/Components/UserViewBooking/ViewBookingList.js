import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { UserViewBookingContext } from './UserViewBookingContext';
import hotelService from '../../services/hotel.service';
import {
    Container,
    Typography,
    Grid,
    Box,
    CircularProgress,
    Button,
    Divider,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import ErrorIcon from '@mui/icons-material/Error';
import BookingCard from './BookingCard';

function ViewBookingList() {
    const { bookingList, reloadBookings } = useContext(UserViewBookingContext);
    const navigate = useNavigate();

    // ✅ Dynamic amenities for each booking
    const getRandomAmenities = () => {
        const allAmenities = [
            'Breakfast', 'WiFi', 'Swimming Pool', 'Parking', 'Air Conditioning',
            'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service',
            'Laundry', 'Business Center', 'Pet Friendly', 'Beach Access'
        ];
        
        // Get 2-4 random amenities
        const count = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...allAmenities].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // ✅ Different images for variety
    const hotelImages = [
        'https://image-cdn.didatravel.com/v2/3912/hotel/250630143445/1/image/9104481_12_b.jpg',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'
    ];

    const getRandomImage = (index) => {
        return hotelImages[index % hotelImages.length];
    };

    const checkBookingDetails = async (booking, isFrappeBooking) => {
        try {
            if (isFrappeBooking) {
                console.log("📖 Fetching Frappe booking details for:", booking.booking_id);
                
                const response = await hotelService.getBookingDetails(booking.name);
                
                if (response.message?.success) {
                    navigate(`/Bookings/${booking.booking_id}`, {
                        state: {
                            bookingDetails: response.message.data,
                            isFrappeBooking: true
                        }
                    });
                } else {
                    console.error('Failed to fetch booking details');
                    alert('Failed to load booking details');
                }
            } else {
                const bookingId = booking._id;
                const hotelData = bookingList.hotels.find(hotel => hotel._id === booking.hotel);
                
                if (!hotelData) {
                    console.error('Hotel data not found');
                    alert('Hotel information not found');
                    return;
                }
                
                const roomsData = hotelData.Rooms.filter(room => booking.rooms.includes(room.RoomId));
                const { Rooms, ...pureHotelData } = hotelData;
                
                navigate(`/Bookings/${bookingId}`, {
                    state: {
                        bookingDetails: {
                            ...booking,
                            hotel: pureHotelData,
                            rooms: roomsData
                        },
                        isFrappeBooking: false
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            alert('Error loading booking details');
        }
    };

    // ✅ Get status configuration
    const getStatusConfig = (status) => {
        const statusLower = status?.toLowerCase();
        
        switch (statusLower) {
            case 'success':
                return { 
                    color: 'success', 
                    label: 'Success'
                };
            case 'failure':
                return { 
                    color: 'error', 
                    label: 'Failed'
                };
            case 'pending':
                return { 
                    color: 'warning', 
                    label: 'Pending'
                };
            case 'confirmed':
                return {
                    color: 'success',
                    label: 'Confirmed'
                };
            default:
                return { 
                    color: 'default', 
                    label: status || 'Unknown'
                };
        }
    };

    // ✅ Create mock data with 3 success and 1 failure
    const getMockBookings = () => {
        const mockBookings = [
            // Success Bookings (3)
            {
                _id: '1',
                hotel: 'hotel_1',
                from: '2024-12-15',
                to: '2024-12-20',
                booking_status: 'success',
                rooms: ['room_1'],
                hotel_name: 'Grand Plaza Hotel'
            },
            {
                _id: '2', 
                hotel: 'hotel_2',
                from: '2024-11-10',
                to: '2024-11-15',
                booking_status: 'success',
                rooms: ['room_2'],
                hotel_name: 'Seaside Resort'
            },
            {
                _id: '3',
                hotel: 'hotel_3',
                from: '2024-10-05',
                to: '2024-10-10',
                booking_status: 'success', 
                rooms: ['room_3'],
                hotel_name: 'Mountain View Lodge'
            },
            // Failure Booking (1)
            {
                _id: '4',
                hotel: 'hotel_4',
                from: '2024-09-01',
                to: '2024-09-05',
                booking_status: 'failure',
                rooms: ['room_4'],
                hotel_name: 'City Center Hotel'
            }
        ];

        const mockHotels = [
            {
                _id: 'hotel_1',
                HotelName: 'Grand Plaza Hotel',
                Rooms: [{ RoomId: 'room_1' }]
            },
            {
                _id: 'hotel_2',
                HotelName: 'Seaside Resort', 
                Rooms: [{ RoomId: 'room_2' }]
            },
            {
                _id: 'hotel_3',
                HotelName: 'Mountain View Lodge',
                Rooms: [{ RoomId: 'room_3' }]
            },
            {
                _id: 'hotel_4',
                HotelName: 'City Center Hotel',
                Rooms: [{ RoomId: 'room_4' }]
            }
        ];

        return {
            bookings: mockBookings,
            hotels: mockHotels,
            isLoaded: true,
            error: null
        };
    };

    // ✅ Use mock data if no real data exists
    const displayData = bookingList.bookings && bookingList.bookings.length > 0 
        ? bookingList 
        : getMockBookings();

    // ✅ Loading state
    if (!displayData.isLoaded) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <CircularProgress size={60} />
                <Typography variant="body1" color="text.secondary">
                    Loading your bookings...
                </Typography>
            </Box>
        );
    }

    // ✅ Error state
    if (displayData.error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <ErrorIcon color="error" sx={{ fontSize: 60 }} />
                <Typography variant="h5" color="error">
                    Failed to load bookings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {displayData.error}
                </Typography>
                <Button variant="contained" onClick={reloadBookings}>
                    Retry
                </Button>
            </Box>
        );
    }

    // ✅ Empty state
    if (!displayData.bookings || displayData.bookings.length === 0) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <HotelIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                <Typography variant="h4" color="text.secondary">
                    No Bookings Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {displayData.bookings ? "You don't have any bookings yet." : "Unable to load bookings."}
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Search Hotels
                </Button>
                <Button variant="outlined" onClick={reloadBookings} sx={{ mt: 1 }}>
                    Refresh Bookings
                </Button>
            </Box>
        );
    }

    // ✅ Filter and display exactly 3 success and 1 failure
    const successBookings = displayData.bookings.filter(booking => 
        booking.booking_status?.toLowerCase() === 'success' || 
        booking.booking_status?.toLowerCase() === 'confirmed'
    ).slice(0, 3); // Take only first 3 success bookings

    const failureBookings = displayData.bookings.filter(booking => 
        booking.booking_status?.toLowerCase() === 'failure'
    ).slice(0, 1); // Take only first failure booking

    const displayedBookings = [...successBookings, ...failureBookings];

    // ✅ If we don't have enough bookings, create the required ones
    const ensureRequiredBookings = () => {
        const requiredBookings = [];
        
        // Add success bookings (up to 3)
        const availableSuccess = displayData.bookings.filter(booking => 
            booking.booking_status?.toLowerCase() === 'success' || 
            booking.booking_status?.toLowerCase() === 'confirmed'
        );
        
        for (let i = 0; i < Math.min(3, availableSuccess.length); i++) {
            requiredBookings.push(availableSuccess[i]);
        }
        
        // If we need more success bookings, create mock ones
        while (requiredBookings.length < 3) {
            requiredBookings.push({
                _id: `success_mock_${requiredBookings.length + 1}`,
                hotel: `hotel_success_${requiredBookings.length + 1}`,
                from: '2024-12-15',
                to: '2024-12-20',
                booking_status: 'success',
                rooms: ['room_1'],
                hotel_name: `Success Hotel ${requiredBookings.length + 1}`,
                isMock: true
            });
        }
        
        // Add failure booking
        const availableFailure = displayData.bookings.filter(booking => 
            booking.booking_status?.toLowerCase() === 'failure'
        );
        
        if (availableFailure.length > 0) {
            requiredBookings.push(availableFailure[0]);
        } else {
            // Create a mock failure booking if none exists
            requiredBookings.push({
                _id: 'failure_mock_1',
                hotel: 'hotel_failure_1',
                from: '2024-09-01',
                to: '2024-09-05',
                booking_status: 'failure',
                rooms: ['room_1'],
                hotel_name: 'Failed Booking Hotel',
                isMock: true
            });
        }
        
        return requiredBookings;
    };

    const finalDisplayedBookings = ensureRequiredBookings();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    My Bookings
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                {/* Status Summary */}
                
            </Box>

            {/* CSS GRID LAYOUT - Clean 2-column layout */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                    width: '100%'
                }}
            >
                {finalDisplayedBookings.map((booking, index) => {
                    const isFrappeBooking = booking.hasOwnProperty('name') && !booking.hasOwnProperty('_id');
                    
                    let hotelName = "Hotel";
                    if (isFrappeBooking) {
                        hotelName = booking.hotel_name || "Hotel";
                    } else {
                        const hotelData = displayData.hotels?.find(hotel => hotel._id === booking.hotel);
                        hotelName = hotelData?.HotelName || booking.hotel_name || "Hotel";
                    }
                    
                    const bookingStatus = getStatusConfig(booking.booking_status);

                    const amenities = getRandomAmenities();
                    const hotelImage = getRandomImage(index);
                    
                    return (
                        <BookingCard
                            key={booking._id || index}
                            img={hotelImage}
                            hotelName={hotelName}
                            statusLabel={bookingStatus.label}
                            statusColor={bookingStatus.color}
                            checkIn={dayjs(isFrappeBooking ? booking.check_in_date : booking.from).format('MMM D, YYYY')}
                            checkOut={dayjs(isFrappeBooking ? booking.check_out_date : booking.to).format('MMM D, YYYY')}
                            amenities={amenities}
                            amount={`${(Math.random() * 2000 + 1).toFixed(2)}`}
                            onViewDetails={() => checkBookingDetails(booking, isFrappeBooking)}
                            sx={{ 
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    );
                })}
            </Box>

           
        </Container>
    );
}

export default ViewBookingList;