import { Paper, Typography, Button, Box, Stack, Divider, Alert, Card, CardContent, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useReward } from 'react-rewards';
import dayjs from "dayjs";

export default function BookingSuccess() {
    const { reward } = useReward('rewardId', 'confetti');
    const location = useLocation();
    const bookingData = location.state?.bookingData;
    const confirmation = bookingData?.confirmation;
    
    console.log('Booking Data:', bookingData);
    console.log('Confirmation:', confirmation);

    useEffect(() => {
        reward();
    }, [reward]);

    // ✅ Calculate tax breakdown safely
    const room = bookingData?.rooms?.[0];
    const allTaxes = room?.Tax || [];
    const inclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Inclusive");
    const nonInclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Not Inclusive");
    const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + (parseFloat(tax.Amount) || 0), 0);
    const basePrice = parseFloat(room?.TotalPrice || room?.baseRate || 0);
    const currency = confirmation?.Currency || room?.Currency || 'USD';
    
    // ✅ Safe total price calculation
    const totalPaid = parseFloat(confirmation?.TotalPrice || bookingData?.totalPrice || 0);
    const isValidTotal = !isNaN(totalPaid) && totalPaid > 0;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', px: 6, paddingBottom: 6 }}>
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

                    {/* ✅ Show confirmation numbers */}
                    {confirmation && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, width: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                                Booking Reference
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                {confirmation.BookingId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Confirmation Code
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {confirmation.ClientReference}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Right: Booking Details */}
                <Box sx={{ flex: 1.5, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" mb={3}>Booking Summary</Typography>
                    <Divider sx={{ mb: 3 }} />

                    {bookingData ? (
                        <Stack spacing={2}>
                            <Typography>
                                <strong>Hotel:</strong> {confirmation?.HotelName || bookingData.hotel?.name || bookingData.hotel?.hotelName}
                            </Typography>
                            <Typography>
                                <strong>Room:</strong> {confirmation?.Rooms?.RoomType?.Room?.Category || bookingData.rooms?.[0]?.Description}
                            </Typography>
                            <Typography>
                                <strong>Room Basis:</strong> {confirmation?.RoomBasis || bookingData.rooms?.[0]?.RoomBasis}
                            </Typography>
                            <Typography>
                                <strong>Guests:</strong> {bookingData.numberOfGuest || 2} adult{(bookingData.numberOfGuest || 2) > 1 ? 's' : ''}
                            </Typography>
                            <Typography>
                                <strong>Duration:</strong> {confirmation?.Nights || bookingData.duration} night{(confirmation?.Nights || bookingData.duration) > 1 ? 's' : ''}
                            </Typography>
                            <Typography>
                                <strong>Check-in:</strong> {confirmation?.ArrivalDate 
                                    ? dayjs(confirmation.ArrivalDate).format('dddd, MMMM D, YYYY') 
                                    : bookingData.from 
                                        ? (typeof bookingData.from === 'string' 
                                            ? dayjs(bookingData.from).format('dddd, MMMM D, YYYY')
                                            : bookingData.from.$d 
                                                ? dayjs(bookingData.from.$d).format('dddd, MMMM D, YYYY')
                                                : dayjs(bookingData.from).format('dddd, MMMM D, YYYY'))
                                        : 'N/A'
                                }
                            </Typography>
                            <Typography>
                                <strong>Check-out:</strong> {bookingData.to 
                                    ? (typeof bookingData.to === 'string'
                                        ? dayjs(bookingData.to).format('dddd, MMMM D, YYYY')
                                        : bookingData.to.$d
                                            ? dayjs(bookingData.to.$d).format('dddd, MMMM D, YYYY')
                                            : dayjs(bookingData.to).format('dddd, MMMM D, YYYY'))
                                    : 'N/A'
                                }
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {/* ✅ Price breakdown - same style as BookRooms */}
                            <Card sx={{ boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Price Summary</Typography>
                                    
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="body2">
                                            Room price ({bookingData.duration} {bookingData.duration > 1 ? 'nights' : 'night'})
                                        </Typography>
                                        <Typography variant="body2">
                                            {currency} {basePrice.toFixed(2)}
                                        </Typography>
                                    </Stack>

                                    {/* ✅ Show inclusive taxes */}
                                    {inclusiveTaxes.length > 0 && (
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="success.main">
                                                Taxes & fees
                                            </Typography>
                                            <Typography variant="caption" color="success.main">
                                                Included
                                            </Typography>
                                        </Stack>
                                    )}

                                    {/* ✅ Show non-inclusive taxes */}
                                    {nonInclusiveTaxes.length > 0 && (
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="warning.main">
                                                Tax
                                            </Typography>
                                            <Typography variant="caption" color="warning.main">
                                                {currency} {totalNonInclusiveTax.toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    )}
                                    
                                    <Divider sx={{ my: 1 }} />
                                    
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "success.light", p: 2, borderRadius: 1 }}>
                                        <Typography variant="h6" color="black" fontWeight="bold">
                                            Total Paid
                                        </Typography>
                                        <Typography variant="h6" color="black" fontWeight="bold">
                                            {isValidTotal ? `${currency} ${totalPaid.toFixed(2)}` : 'N/A'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* ✅ Cancellation policy */}
                            {confirmation?.CancellationDeadline && (
                                <Alert severity="info">
                                    Free cancellation until {dayjs(confirmation.CancellationDeadline).format('MMMM D, YYYY')}
                                </Alert>
                            )}

                            {/* ✅ Booking status */}
                            {confirmation?.BookingStatus && (
                                <Alert severity="success">
                                    <strong>Status:</strong> {confirmation.BookingStatus.status} - {confirmation.BookingStatus.desc}
                                </Alert>
                            )}
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