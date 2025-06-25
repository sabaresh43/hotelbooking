import { Paper, Typography, Button, Box, Stack, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useReward } from 'react-rewards';
import dayjs from "dayjs";

export default function BookingSuccess() {
    const { reward } = useReward('rewardId', 'confetti');
    const location = useLocation();
    const bookingData = location.state?.bookingData;
    console.log('Booking Data:', bookingData);
    

    useEffect(() => {
        reward();
    }, [reward]);

    return (
<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', px: 6,paddingBottom: 6 }}>
    <Paper
        elevation={3}
        sx={{
            width: '100%',              
            maxWidth: '1400px',       
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mx: 'auto',
        }}
    >
        {/* Left: Success Message */}
        <Box sx={{
            flex: 1,
            bgcolor: 'success.light',
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 350
        }}>
            <CheckCircleIcon sx={{ fontSize: 120, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" fontWeight="600" id="rewardId" textAlign="center">
                Booking Confirmed!
            </Typography>
            <Typography color="text.secondary" textAlign="center" mt={1}>
                Your booking details have been sent to your registered email.
            </Typography>
        </Box>

        {/* Right: Booking Details */}
        <Box sx={{ flex: 1.5, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" mb={3}>Booking Summary</Typography>
            <Divider sx={{ mb: 3 }} />

            {bookingData ? (
                <Stack spacing={2}>
                    <Typography><strong>Hotel:</strong> {bookingData.hotel.hotelName}</Typography>
                    <Typography><strong>Room(s):</strong> {bookingData.rooms.length}</Typography>
                    <Typography><strong>Guests:</strong> {bookingData.guests || 2}</Typography>
                    <Typography><strong>Total Price:</strong> ₹{bookingData.totalPrice}</Typography>
                    <Typography><strong>Check-in:</strong> {dayjs(bookingData.from.$d).format('dddd, MMMM D, YYYY')}</Typography>
                    <Typography><strong>Check-out:</strong> {dayjs(bookingData.to.$d).format('dddd, MMMM D, YYYY')}</Typography>
                </Stack>
            ) : (
                <Typography color="text.secondary">Booking details not available.</Typography>
            )}

            <Stack direction="row" spacing={2} mt={4} justifyContent="flex-start">
                <Button component={Link} variant="contained" to="/Bookings">View My Bookings</Button>
                <Button component={Link} variant="outlined" to="/">Go to Home</Button>
            </Stack>
        </Box>
    </Paper>
</Box>
    );
}
