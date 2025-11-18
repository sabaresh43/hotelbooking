import { Box, Card, CardContent, Divider, Grid, Stack, Typography, Container, Button, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import BookingContext from "./BookingContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import hotelService, { trackActivity } from "../../services/hotel.service";

function BookingReview({ prevStep }) {
    const { bookingData, dispatch } = useContext(BookingContext);
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const navigate = useNavigate();
    const [isBookingFailed, setIsBookingFailed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(null);

    const goBack = () => {
        prevStep();
        navigate(-1);
    };

    // ✅ Helper to get title from name
    const getTitleFromName = (firstName) => {
        const commonMaleNames = ['john', 'james', 'robert', 'michael', 'william', 'david', 'jim'];
        const lowerName = firstName.toLowerCase();
        return commonMaleNames.includes(lowerName) ? 'MR.' : 'MRS.';
    };

const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsBookingFailed(false);
    setError(null);

    try {
        // ✅ All rooms are the same type, use first one as template
        const selectedRoom = bookingData.rooms[0];
        
        // ✅ Calculate total payable amount for ALL rooms
        let totalPayableAmount = 0;
        
        bookingData.rooms.forEach(room => {
            const basePrice = parseFloat(room.TotalPrice || room.baseRate || 0);
            const nonInclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Not Inclusive") || [];
            const totalTax = nonInclusiveTaxes.reduce((sum, tax) => sum + parseFloat(tax.Amount || 0), 0);
            
            // ✅ Also include Fee array
            const fees = room.Fee || [];
            const totalFees = fees.reduce((sum, fee) => sum + parseFloat(fee.Amount || 0), 0);
            
            totalPayableAmount += basePrice + totalTax;
        });

        console.log('💰 Calculated Total Payable Amount:', totalPayableAmount);

        // ✅ Prepare rooms array - one entry per room with proper occupancy
        const roomsPayload = bookingData.occupancy.map((roomOccupancy, roomIndex) => {
            // Prepare guests for this room
            let guests = [];
            
            if (roomIndex === 0) {
                // First room gets collected guest details
                if (bookingData.clientInfo.guests && bookingData.clientInfo.guests.length > 0) {
                    guests = bookingData.clientInfo.guests.map(guest => ({
                        title: guest.title,
                        firstName: guest.firstName.toUpperCase(),
                        lastName: guest.lastName.toUpperCase()
                    }));
                } else {
                    guests.push({
                        title: bookingData.clientInfo.title || "MR.",
                        firstName: bookingData.clientInfo.firstName.toUpperCase(),
                        lastName: bookingData.clientInfo.lastName.toUpperCase()
                    });
                }
                
                // Fill remaining adults
                while (guests.length < roomOccupancy.adults) {
                    guests.push({
                        title: "MR.",
                        firstName: "GUEST",
                        lastName: `${guests.length + 1}`
                    });
                }
            } else {
                // Other rooms: placeholder guests
                for (let i = 0; i < roomOccupancy.adults; i++) {
                    guests.push({
                        title: "MR.",
                        firstName: "GUEST",
                        lastName: `${i + 1}`
                    });
                }
            }
            
            return {
                adults: roomOccupancy.adults,
                children: roomOccupancy.childAges?.length || 0,
                childAges: roomOccupancy.childAges || [],
                guests: guests,
                roomCode: selectedRoom.HotelSearchCode
            };
        });

        // ✅ Prepare booking payload to store in sessionStorage
        const bookingPayload = {
            hotelId: bookingData.hotel.id,
            hotelName: bookingData.hotel.name || bookingData.hotel.hotelName || '',
            roomCode: selectedRoom.HotelSearchCode,
            fromDate: dayjs(bookingData.from).format('YYYY-MM-DD'),
            toDate: dayjs(bookingData.to).format('YYYY-MM-DD'),
            rooms: roomsPayload,
            currency: selectedRoom.Currency || 'USD',
            country: 'IN',
            payable_amount: parseFloat(totalPayableAmount.toFixed(2)),
            contact: {
                Name: {
                    First: bookingData.clientInfo.firstName,
                    Last: bookingData.clientInfo.lastName
                },
                Email: bookingData.clientInfo.email,
                Phone: bookingData.clientInfo.phone
            }
        };

        // ✅ Store booking data in sessionStorage (will be used after payment callback)
        sessionStorage.setItem('pendingBooking', JSON.stringify({
            bookingPayload,
            bookingData: {
                ...bookingData,
                actualTotalPrice: totalPayableAmount,
                totalPrice: totalPayableAmount
            }
        }));

        console.log('📤 Stored booking data in sessionStorage');

        // ✅ Create payment
        const paymentPayload = {
            amount: parseFloat(totalPayableAmount.toFixed(2)),
            email: bookingData.clientInfo.email,
            name: `${bookingData.clientInfo.firstName} ${bookingData.clientInfo.lastName}`,
            phone: bookingData.clientInfo.phone,
            purpose: `Hotel Booking - ${bookingData.hotel.name || bookingData.hotel.hotelName}`,
            payment_methods: ["card", "paynow_online"]
        };

        console.log('💳 Creating payment:', paymentPayload);

        const paymentResponse = await hotelService.createPayment(paymentPayload);

        console.log('💳 Payment response:', paymentResponse);

        if (paymentResponse.data.payment_url) {
            // Track payment initiation
            trackActivity("payment_initiated").catch((err) =>
                console.error("Activity tracking failed:", err)
            );

            // ✅ Store payment reference
            sessionStorage.setItem('paymentReference', paymentResponse.data.payment_id);

            // ✅ Redirect to payment URL
            console.log('🔗 Redirecting to payment URL:', paymentResponse.data.payment_url);
            window.location.href = paymentResponse.data.payment_url;
        } else {
            throw new Error('Payment URL not received from payment gateway');
        }

    } catch (error) {
        console.error('❌ Payment creation failed:', error);
        setIsSubmitting(false);
        setIsBookingFailed(true);
        setError(error);
        setErrorMessage(error.response?.data?.message || error.message || 'Payment initialization failed');
    }
};

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Stack spacing={4}>
                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Guest Details
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    First Name
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.clientInfo.firstName}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    Last Name
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.clientInfo.lastName}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    Email
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.clientInfo.email}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.clientInfo.phone}
                                </Typography>
                            </Grid>
                            {/* Additional guest information */}
                            {bookingData.clientInfo.guests && bookingData.clientInfo.guests.length > 0 && (
                                <Grid size={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Additional Guests
                                    </Typography>
                                    {bookingData.clientInfo.guests.map((guest, index) => (
                                        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                                            <Grid size={4}>
                                                <Typography variant="body2">
                                                    Guest {index + 1}:
                                                </Typography>
                                            </Grid>
                                            <Grid size={8}>
                                                <Typography variant="body2">
                                                    {guest.title} {guest.firstName} {guest.lastName}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Payment Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Alert severity="info">
                                    You will be redirected to a secure payment page to complete your booking.
                                </Alert>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ✅ Show booking summary */}
                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Booking Summary
                        </Typography>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Hotel:</Typography>
                                <Typography fontWeight={600}>{bookingData.hotel.name || bookingData.hotel.hotelName}</Typography>
                            </Box>
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Typography fontWeight={600}>Rooms:</Typography>
                {bookingData.rooms.map((room, index) => (
                    <Box key={index} sx={{ pl: 2 }}>
                        <Typography variant="body2">
                            • Room {index + 1}: {room.Description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {room.RoomBasis}
                        </Typography>
                    </Box>
                ))}
            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Check-in:</Typography>
                                <Typography>{dayjs(bookingData.from).format('MMM D, YYYY')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Check-out:</Typography>
                                <Typography>{dayjs(bookingData.to).format('MMM D, YYYY')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Duration:</Typography>
                                <Typography>{bookingData.duration} night{bookingData.duration > 1 ? 's' : ''}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Guests:</Typography>
                                <Typography>{bookingData.numberOfGuest} adult{bookingData.numberOfGuest > 1 ? 's' : ''}</Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            {/* ✅ Price breakdown */}
                            {bookingData.rooms.map((room, index) => {
                                const allTaxes = room.Tax || [];
                                const inclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Inclusive");
                                const nonInclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Not Inclusive");
                                const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + tax.Amount, 0);
                                const basePrice = room.TotalPrice || room.baseRate || 0;
                                const currency = room.Currency || 'USD';

                                return (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography>Room price:</Typography>
                                            <Typography>{currency} {basePrice.toFixed(2)}</Typography>
                                        </Box>

                                        {inclusiveTaxes.length > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="success.main">
                                                    Taxes & fees:
                                                </Typography>
                                                <Typography variant="body2" color="success.main">
                                                    Included {currency} {inclusiveTaxes.reduce((sum, tax) => sum + tax.Amount, 0)}
                                                </Typography>
                                            </Box>
                                        )}

                                        {nonInclusiveTaxes.length > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Taxes (at property):
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {currency} {totalNonInclusiveTax.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}

                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" color="primary">Total to Pay Now:</Typography>
                                <Typography variant="h6" color="primary" fontWeight={700}>
                                    {bookingData.rooms[0].Currency} {bookingData.totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        size="large"
                        onClick={goBack}
                        color="primary"
                        disabled={isSubmitting}
                        sx={{ mr: 2, alignSelf: 'flex-end' }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        color="primary"
                        disabled={isSubmitting}
                        sx={{ alignSelf: 'flex-end' }}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                </Box>

                {isBookingFailed && (
                    <Alert severity="error">
                        {errorMessage || 'Payment initialization failed. Please try again or contact support.'}
                    </Alert>
                )}
            </Stack>
        </Container>
    );
}

export default BookingReview;
