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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import ErrorIcon from '@mui/icons-material/Error';
import BookingCard from './BookingCard';

function ViewBookingList() {
    const { bookingList, reloadBookings } = useContext(UserViewBookingContext);
    const navigate = useNavigate();

    // Cancel dialog state
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

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

    // Handle cancel booking
    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        try {
            // TODO: Implement actual cancel API call
            // await hotelService.cancelBooking(selectedBooking.booking_id);

            console.log('Cancelling booking:', selectedBooking);

            // Close cancel dialog
            setCancelDialogOpen(false);

            // Show success dialog instead of toast
            setSuccessDialogOpen(true);

        } catch (error) {
            console.error('Error cancelling booking:', error);
            setCancelDialogOpen(false);
            setSnackbar({
                open: true,
                message: 'Failed to cancel booking. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleSuccessDialogClose = () => {
        setSuccessDialogOpen(false);
        setSelectedBooking(null);
        // Reload bookings when closing success dialog
        reloadBookings();
    };

    const handleCancelDialogClose = () => {
        setCancelDialogOpen(false);
        setSelectedBooking(null);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
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

    // ✅ Create mock data with single booking from API response
    const getMockBookings = () => {
        const singleBooking = {
            _id: '30223001',
            booking_id: '30223001',
            hotel: '318188',
            from: '2025-12-22',
            to: '2025-12-24', // ArrivalDate + Nights (2)
            check_in_date: '2025-12-22',
            check_out_date: '2025-12-24',
            booking_status: 'Confirmed',
            rooms: ['1'],
            hotel_name: 'DUTCH DESIGN ARTEMIS',
            total_price: '5.00',
            currency: 'EUR',
            nights: 2,
            room_category: 'Superior Twin - Refundable - Cancellation Failure',
            room_basis: 'ROOM ONLY',
            cancellation_deadline: '2025-12-19',
            go_reference: 'GO28016476-30223001-A(INT)',
            client_booking_code: '1765302528669',
            created_date: '2025-12-09 18:48',
            guests: [
                {
                    person_id: '1',
                    first_name: 'DESTIN',
                    last_name: 'TECH',
                    title: 'MR.'
                },
                {
                    person_id: '2',
                    first_name: 'DESTIN',
                    last_name: 'TEST',
                    title: 'MR.'
                }
            ],
            adults: 2,
            nationality: 'IN'
        };

        const singleHotel = {
            _id: '318188',
            HotelName: 'DUTCH DESIGN ARTEMIS',
            HotelSearchCode: '28764321',
            CityCode: '75',
            Rooms: [{
                RoomId: '1',
                Category: 'Superior Twin - Refundable - Cancellation Failure',
                RoomBasis: 'ROOM ONLY'
            }]
        };

        return {
            bookings: [singleBooking],
            hotels: [singleHotel],
            isLoaded: true,
            error: null
        };
    };

    // ✅ Always use mock data for testing
    const displayData = getMockBookings();

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

    // ✅ Display only one booking
    const finalDisplayedBookings = displayData.bookings.slice(0, 1);

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
                            roomBasis={booking.room_basis || 'N/A'}
                            roomCategory={booking.room_category || 'N/A'}
                            amount={booking.total_price ? `${booking.currency || ''} ${booking.total_price}` : `${(Math.random() * 2000 + 1).toFixed(2)}`}
                            onViewDetails={() => checkBookingDetails(booking, isFrappeBooking)}
                            onCancel={() => handleCancelClick(booking)}
                            sx={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    );
                })}
            </Box>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={handleCancelDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                    Cancel Booking?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking for <strong>{selectedBooking?.hotel_name || 'this hotel'}</strong>?
                        <br /><br />
                        This action cannot be undone. Please review the cancellation policy before proceeding.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCancelDialogClose}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Keep Booking
                    </Button>
                    <Button
                        onClick={handleCancelConfirm}
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Confirmation Dialog */}
            <Dialog
                open={successDialogOpen}
                onClose={handleSuccessDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'error.main', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    Cancellation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your Cancellation Request for <strong>{selectedBooking?.hotel_name || 'this hotel'}</strong> has been received.
                        <br /><br />
                        You will receive a confirmation email shortly.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleSuccessDialogClose}
                        variant="contained"
                        color="success"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        fontWeight: 600
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Container>
    );
}

export default ViewBookingList;