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
            
            totalPayableAmount += basePrice + totalTax + totalFees;
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

        // ✅ Prepare booking payload with payable_amount
        const bookingPayload = {
            hotelId: bookingData.hotel.id,
            hotelName: bookingData.hotel.name || bookingData.hotel.hotelName || '',
            roomCode: selectedRoom.HotelSearchCode,
            fromDate: dayjs(bookingData.from).format('YYYY-MM-DD'),
            toDate: dayjs(bookingData.to).format('YYYY-MM-DD'),
            rooms: roomsPayload,
            currency: selectedRoom.Currency || 'USD',
            country: 'IN',
            payable_amount: parseFloat(totalPayableAmount.toFixed(2)),  // ✅ Total amount to pay
            contact: {
                Name: {
                    First: bookingData.clientInfo.firstName,
                    Last: bookingData.clientInfo.lastName
                },
                Email: bookingData.clientInfo.email,
                Phone: bookingData.clientInfo.phone
            }
        };

        console.log('📤 Submitting booking:', bookingPayload);

        const bookingResponse = await hotelService.bookHotel(bookingPayload);

        console.log('📥 Booking response:', bookingResponse);

        if (bookingResponse.success) {
            // Track booking success
            trackActivity("booking_success").catch((err) =>
                console.error("Activity tracking failed:", err)
            );

            // ✅ Pass total price to confirmation
            dispatch({
                type: 'setBookingConfirmation',
                payload: {
                    data: bookingResponse.data
                }
            });

            dispatch({ type: 'setIsBookingSuccess' });

            // ✅ CRITICAL: Pass calculated total explicitly in multiple places
            console.log('✈️ Navigating with actualTotalPrice:', totalPayableAmount);
            
            navigate("../success", {
                state: {
                    bookingData: {
                        ...bookingData,
                        actualTotalPrice: totalPayableAmount,  // ✅ Pass calculated total
                        totalPrice: totalPayableAmount,        // ✅ Also update this
                        confirmation: {
                            ...bookingResponse.data,
                            actualTotalPrice: totalPayableAmount  // ✅ Also in confirmation
                        }
                    }
                }
            });
        } else {
            // Track booking failure
            trackActivity("booking_failure").catch((err) =>
                console.error("Activity tracking failed:", err)
            );
            setIsBookingFailed(true);
        }
    } catch (error) {
        console.error('Booking error:', error);
        // Track booking failure
        trackActivity("booking_failure").catch((err) =>
            console.error("Activity tracking failed:", err)
        );
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
                                                    Included {totalNonInclusiveTax}
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

