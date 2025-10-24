import { Box, Card, CardContent, Divider, Grid, Stack, Typography, Container, Button, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import BookingContext from "./BookingContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import hotelService from "../../services/hotel.service";

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
            // ✅ Get room data (assuming single room booking)
            const room = bookingData.rooms[0];

            // ✅ Prepare guests array
            const guests = [];

            // Primary guest from clientInfo
            guests.push({
                title: getTitleFromName(bookingData.clientInfo.firstName),
                firstName: bookingData.clientInfo.firstName.toUpperCase(),
                lastName: bookingData.clientInfo.lastName.toUpperCase()
            });

            // Add additional guests if numberOfGuest > 1
            for (let i = 1; i < bookingData.numberOfGuest; i++) {
                guests.push({
                    title: "MR.",
                    firstName: "GUEST",
                    lastName: ` Added`
                });
            }

            // ✅ Prepare booking payload
            const bookingPayload = {
                 hotelId: bookingData.hotel.id,
                roomCode: room.HotelSearchCode,
                fromDate: dayjs(bookingData.from).format('YYYY-MM-DD'),
                toDate: dayjs(bookingData.to).format('YYYY-MM-DD'),
                rooms: [
                    {
                        adults: bookingData.numberOfGuest,
                        guests: guests
                    }
                ],
                currency: room.Currency || 'USD',
                country: 'IN',
                contact: {
                    Name: {
                        First: bookingData.clientInfo.firstName,
                        Last: bookingData.clientInfo.lastName
                    },
                    Email: bookingData.clientInfo.email,
                    Phone: bookingData.clientInfo.phone
                }
            };

            console.log('Submitting booking:', bookingPayload);

            // ✅ Call booking API
            const bookingResponse = await hotelService.bookHotel(bookingPayload);

            console.log('Booking response:', bookingResponse);

            if (bookingResponse.success) {
                // ✅ Store booking confirmation in context
                dispatch({
                    type: 'setBookingConfirmation',
                    payload: {
                        data: bookingResponse.data
                    }
                });

                // ✅ Mark booking as successful
                dispatch({ type: 'setIsBookingSuccess' });

                // ✅ Navigate to success page with booking data
                navigate("../success", {
                    state: {
                        bookingData: {
                            ...bookingData,
                            confirmation: bookingResponse.data
                        }
                    }
                });
            } else {
                setIsBookingFailed(true);
            }
        } catch (error) {
            console.error('Booking error:', error);
            setIsBookingFailed(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Personal Details
                        </Typography>
                        <Grid container columnSpacing={0} rowSpacing={1}>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    First Name
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    {bookingData.clientInfo.firstName}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    Last Name
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    {bookingData.clientInfo.lastName}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    Email
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    {bookingData.clientInfo.email}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="body1">
                                    {bookingData.clientInfo.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Grid container columnSpacing={0} rowSpacing={1}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Billing Address
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.cardInfo.address.street}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.cardInfo.address.city}, {bookingData.cardInfo.address.province}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {bookingData.cardInfo.address.postalCode}, {bookingData.cardInfo.address.country.toUpperCase()}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 2, md: 0 } }}>
                                <Grid size={12}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Payment Details
                                    </Typography>
                                </Grid>
                                <Grid container size={12} columnSpacing={0} rowSpacing={1}>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            Card Holder Name
                                        </Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            {bookingData.cardInfo.cardName}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            Card Number
                                        </Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            {"xxxx-xxxx-xxxx-" + bookingData.cardInfo.cardNumber.slice(-4)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            Expiry Date
                                        </Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1" gutterBottom>
                                            {`${bookingData.cardInfo.expDate.substring(0, 2)}/${bookingData.cardInfo.expDate.substring(2)}`}
                                        </Typography>
                                    </Grid>
                                </Grid>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Room:</Typography>
                                <Typography>{bookingData.rooms[0].Description}</Typography>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" color="primary">Total:</Typography>
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
                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                </Box>

                {isBookingFailed && (
                    <Alert severity="error">
                        Booking failed. Please try again or contact support.
                    </Alert>
                )}
            </Stack>
        </Container>
    );
}

export default BookingReview;

