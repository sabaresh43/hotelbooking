import { useContext } from "react";
import UserViewBookingContext from "./UserViewBookingContext";
import { Button, Card, CardContent, CircularProgress, Container, Typography, Grid, Box, Chip, Divider } from "@mui/material";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import hotelService from "../../services/hotel.service";

function ViewBookingList() {
    const { bookingList } = useContext(UserViewBookingContext);
    const navigate = useNavigate();

    const checkBookingDetails = async (bookingId, isFrappeBooking, supplier) => {
        if (isFrappeBooking) {
            // ✅ Fetch booking details from Supplier API
            const response = await hotelService.getBookingDetails(bookingId, supplier);
            if (response.success) {
                navigate(`/Bookings/${bookingId}`, {
                    state: {
                        bookingDetails: response.message,
                        isFrappeBooking: true
                    }
                });
            } else {
                console.error('Failed to fetch booking details');
            }
        } else {
            // Old logic for legacy bookings
            const booking = bookingList.bookings.find(booking => booking._id === bookingId);
            const hotelData = bookingList.hotels.find(hotel => hotel._id === booking.hotel);
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
    }

    // only render when the data is ready
    if (!bookingList.isLoaded) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ mt: 5, mx: 'auto' }}>
                <CircularProgress />
            </Box>
        );
    } else {
        if (bookingList.bookings.length === 0) {
            return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ mt: 5, mx: 'auto' }}>
                <Typography variant="h4">It seems you don't have any booking yet.</Typography>
            </Box>);
        } else {
            return (
                <Container sx={{ margin: "auto", mt: 3 }}>
                    <Typography variant="h3" sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        my: 2
                    }}>
                        My Bookings
                    </Typography>
                    <Grid container rowSpacing={3} columnSpacing={3} sx={{ mt: 3 }}>
                        {bookingList.bookings.map((booking) => {
                            // ✅ Check if this is a Frappe booking (has employee_id) or old booking (has _id)
                            const isFrappeBooking = booking.hasOwnProperty('employee_id');
                            const bookingId = isFrappeBooking ? booking.booking_id : booking._id;
                            const hotelName = isFrappeBooking 
                                ? booking.hotel_name 
                                : bookingList.hotels.find(hotel => hotel._id === booking.hotel)?.HotelName;
                            
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bookingId}>
                                    <Card sx={{ 
                                        ":hover": { boxShadow: 8, transform: 'translateY(-4px)' },
                                        boxShadow: 3,
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            {/* Booking Status Badge */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Chip 
                                                    label={isFrappeBooking ? booking.booking_status : 'Confirmed'}
                                                    color={isFrappeBooking && booking.booking_status === 'Success' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                                {isFrappeBooking && (
                                                    <Chip 
                                                        label={booking.payment_status}
                                                        color={booking.payment_status === 'Success' ? 'success' : 'warning'}
                                                        size="small"
                                                        icon={<PaymentIcon />}
                                                    />
                                                )}
                                            </Box>

                                            {/* Hotel Name */}
                                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 1,
                                                color: 'primary.main'
                                            }}>
                                                <HotelIcon />
                                                {hotelName}
                                            </Typography>

                                            <Divider sx={{ my: 1.5 }} />

                                            {/* Booking ID */}
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                                Booking ID: {bookingId}
                                            </Typography>

                                            {/* Check-in/Check-out */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                                <CalendarTodayIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2">
                                                        <strong>Check-in:</strong> {dayjs(isFrappeBooking ? booking.check_in_date : booking.from).format('MMM D, YYYY')}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Check-out:</strong> {dayjs(isFrappeBooking ? booking.check_out_date : booking.to).format('MMM D, YYYY')}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Guest Count */}
                                            {isFrappeBooking && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <PersonIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {booking.guest_count} Guest{booking.guest_count > 1 ? 's' : ''}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Room Type */}
                                            {isFrappeBooking && booking.room_type && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    <strong>Room:</strong> {booking.room_type}
                                                </Typography>
                                            )}

                                            <Divider sx={{ my: 1.5 }} />

                                            {/* Price */}
                                            <Typography variant="h6" color="primary" fontWeight={700} sx={{ mb: 2 }}>
                                                {isFrappeBooking ? booking.currency : 'CAD'} {isFrappeBooking ? booking.total_price.toFixed(2) : booking.totalPrice.toFixed(2)}
                                            </Typography>

                                            {/* View Details Button */}
                                            <Button 
                                                variant="contained" 
                                                fullWidth
                                                onClick={() => checkBookingDetails(bookingId, isFrappeBooking, booking.supplier)}
                                                sx={{ mt: 'auto' }}
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
    }
}

export default ViewBookingList;
