import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { UserViewBookingContext } from './UserViewBookingContext';
import hotelService from '../../services/hotel.service';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Box,
    Divider,
    CircularProgress
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';

function ViewBookingList() {
    const { bookingList, reloadBookings } = useContext(UserViewBookingContext);
    const navigate = useNavigate();

    const checkBookingDetails = async (booking, isFrappeBooking) => {
        try {
            if (isFrappeBooking) {
                console.log("📖 Fetching Frappe booking details for:", booking.booking_id);
                
                // ✅ Fetch booking details from Frappe API using 'name' field
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
                // ✅ Old booking logic
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
                    icon: <CheckCircleIcon fontSize="small" />,
                    label: 'Success'
                };
            case 'failure':
                return { 
                    color: 'error', 
                    icon: <ErrorIcon fontSize="small" />,
                    label: 'Failed'
                };
            case 'pending':
                return { 
                    color: 'warning', 
                    icon: <PendingIcon fontSize="small" />,
                    label: 'Pending'
                };
            case 'confirmed':
                return {
                    color: 'success',
                    icon: <CheckCircleIcon fontSize="small" />,
                    label: 'Confirmed'
                };
            default:
                return { 
                    color: 'default', 
                    icon: null,
                    label: status || 'Unknown'
                };
        }
    };

    // ✅ Loading state
    if (!bookingList.isLoaded) {
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
    if (bookingList.error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <ErrorIcon color="error" sx={{ fontSize: 60 }} />
                <Typography variant="h5" color="error">
                    Failed to load bookings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {bookingList.error}
                </Typography>
                <Button variant="contained" onClick={reloadBookings}>
                    Retry
                </Button>
            </Box>
        );
    }

    // ✅ Empty state
    if (bookingList.bookings.length === 0) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <HotelIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                <Typography variant="h4" color="text.secondary">
                    No Bookings Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Start exploring and book your first hotel!
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Search Hotels
                </Button>
            </Box>
        );
    }

    // ✅ Bookings list
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    My Bookings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    You have {bookingList.bookings.length} booking{bookingList.bookings.length !== 1 ? 's' : ''}
                </Typography>
            </Box>

            {/* Bookings Grid */}
            <Grid container spacing={3}>
                {bookingList.bookings.map((booking) => {
                    // ✅ Check if Frappe booking (has 'name' field) or old booking (has '_id')
                    const isFrappeBooking = booking.hasOwnProperty('name') && !booking.hasOwnProperty('_id');
                    const bookingId = isFrappeBooking ? booking.booking_id : booking._id;
                    const hotelName = isFrappeBooking 
                        ? booking.hotel_name 
                        : bookingList.hotels.find(hotel => hotel._id === booking.hotel)?.HotelName || 'Hotel';
                    
                    const bookingStatus = getStatusConfig(
                        isFrappeBooking ? booking.booking_status : 'Confirmed'
                    );
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} key={isFrappeBooking ? booking.name : booking._id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        boxShadow: 8, 
                                        transform: 'translateY(-4px)' 
                                    },
                                    boxShadow: 3,
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    {/* Status Badge */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Chip 
                                            label={bookingStatus.label}
                                            color={bookingStatus.color}
                                            size="small"
                                            icon={bookingStatus.icon}
                                        />
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            #{bookingId}
                                        </Typography>
                                    </Box>

                                    {/* Hotel Name */}
                                    <Typography 
                                        variant="h6" 
                                        fontWeight={600} 
                                        gutterBottom 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'primary.main',
                                            mb: 2
                                        }}
                                    >
                                        <HotelIcon />
                                        {hotelName}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Guest Name (Frappe only) */}
                                    {isFrappeBooking && booking.employee_name && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <PersonIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {booking.employee_name}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Check-in/Check-out Dates */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Check-in:</strong> {dayjs(isFrappeBooking ? booking.check_in_date : booking.from).format('MMM D, YYYY')}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Check-out:</strong> {dayjs(isFrappeBooking ? booking.check_out_date : booking.to).format('MMM D, YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Duration */}
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                        {dayjs(isFrappeBooking ? booking.check_out_date : booking.to).diff(
                                            dayjs(isFrappeBooking ? booking.check_in_date : booking.from), 
                                            'day'
                                        )} night{dayjs(isFrappeBooking ? booking.check_out_date : booking.to).diff(
                                            dayjs(isFrappeBooking ? booking.check_in_date : booking.from), 
                                            'day'
                                        ) !== 1 ? 's' : ''}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Price (if available) */}
                                    {(isFrappeBooking || booking.totalPrice) && (
                                        <Typography variant="h6" color="primary" fontWeight={700} sx={{ mb: 2 }}>
                                            {isFrappeBooking ? (booking.currency || 'EUR') : 'CAD'} {' '}
                                            {isFrappeBooking ? booking.total_price?.toFixed(2) : booking.totalPrice?.toFixed(2)}
                                        </Typography>
                                    )}

                                    {/* View Details Button */}
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        onClick={() => checkBookingDetails(booking, isFrappeBooking)}
                                        sx={{ 
                                            mt: 'auto',
                                            borderRadius: 2,
                                            py: 1.2,
                                            fontWeight: 600
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}

export default ViewBookingList;