import { Box, Card, CardContent, Divider, Grid, Stack, Typography, Container, Button, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import BookingContext from "./BookingContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import hotelService, { trackActivity } from "../../services/hotel.service";
import paymentService from "../../services/paymentService";

function BookingReview({ prevStep }) {
    const { bookingData, dispatch } = useContext(BookingContext);
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const goBack = () => {
        prevStep();
        navigate(-1);
    };

    const handlePayment = async () => {
        try {
            const userData = bookingData.clientInfo;

            const res = await paymentService.createPayment({
                amount: bookingData.totalPrice || 10,
                email: userData.email,
                name: userData.firstName + " " + userData.lastName,
                phone: userData.phone,
            });

            console.log("Payment Service Response:", res);

            if (res?.message?.payment_url) {
                localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
                window.location.href = res.message.payment_url;
                return true;
            }

            throw new Error("Payment URL not received");
        } catch (error) {
            console.error("Payment initiation failed:", error);
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const selectedRoom = bookingData.rooms[0];

            let totalPayableAmount = 0;
            bookingData.rooms.forEach(room => {
                const basePrice = parseFloat(room.TotalPrice || room.baseRate || 0);
                const nonInclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Not Inclusive") || [];
                const totalTax = nonInclusiveTaxes.reduce((sum, tax) => sum + (parseFloat(tax.Amount || 0)), 0);
                totalPayableAmount += basePrice + totalTax;
            });

            console.log("💰 Calculated Total Payable Amount:", totalPayableAmount);

            const roomsPayload = bookingData.occupancy.map((roomOcc, roomIndex) => {
                let guests = [];

                if (roomIndex === 0) {
                    if (bookingData.clientInfo.guests?.length > 0) {
                        guests = bookingData.clientInfo.guests.map(guest => ({
                            title: guest.title,
                            firstName: guest.firstName.toUpperCase(),
                            lastName: guest.lastName.toUpperCase()
                        }));
                    } else {
                        guests.push({
                            title: bookingData.clientInfo.title,
                            firstName: bookingData.clientInfo.firstName.toUpperCase(),
                            lastName: bookingData.clientInfo.lastName.toUpperCase()
                        });
                    }

                    while (guests.length < roomOcc.adults) {
                        guests.push({
                            title: "MR.",
                            firstName: "GUEST",
                            lastName: `${guests.length + 1}`
                        });
                    }
                } else {
                    for (let i = 0; i < roomOcc.adults; i++) {
                        guests.push({
                            title: "MR.",
                            firstName: "GUEST",
                            lastName: `${i + 1}`
                        });
                    }
                }

                return {
                    adults: roomOcc.adults,
                    children: roomOcc.childAges?.length || 0,
                    childAges: roomOcc.childAges || [],
                    guests,
                    roomCode: selectedRoom.HotelSearchCode
                };
            });

            const bookingPayload = {
                hotelId: bookingData.hotel.id,
                hotelName: bookingData.hotel.name || bookingData.hotel.hotelName || "",
                roomCode: selectedRoom.HotelSearchCode,
                fromDate: dayjs(bookingData.from).format("YYYY-MM-DD"),
                toDate: dayjs(bookingData.to).format("YYYY-MM-DD"),
                rooms: roomsPayload,
                currency: selectedRoom.Currency || "USD",
                country: "IN",
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

            console.log("📤 Submitting booking:", bookingPayload);

            // 🔥 TRY BOOKING — BUT NO ERROR SHOWN IF FAILS
            try {
                const bookingResponse = await hotelService.bookHotel(bookingPayload);
                console.log("📥 Booking response:", bookingResponse);
            } catch (bookingError) {
                console.error("❌ Booking failed — but continuing to payment");
            }

            // 🔥 ALWAYS ATTEMPT PAYMENT
            const paymentSuccess = await handlePayment();

            if (paymentSuccess) {
                trackActivity("booking_success").catch((err) =>
                    console.error("Activity tracking failed:", err)
                );

                dispatch({
                    type: "setBookingConfirmation",
                    payload: {}
                });

                dispatch({ type: "setIsBookingSuccess" });

                console.log("✈️ Proceeding with Total:", totalPayableAmount);
            }

        } catch (error) {
            console.error("Unexpected error:", error);
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
                            <Grid size={6}><Typography>First Name</Typography></Grid>
                            <Grid size={6}><Typography>{bookingData.clientInfo.firstName}</Typography></Grid>

                            <Grid size={6}><Typography>Last Name</Typography></Grid>
                            <Grid size={6}><Typography>{bookingData.clientInfo.lastName}</Typography></Grid>

                            <Grid size={6}><Typography>Email</Typography></Grid>
                            <Grid size={6}><Typography>{bookingData.clientInfo.email}</Typography></Grid>

                            <Grid size={6}><Typography>Phone</Typography></Grid>
                            <Grid size={6}><Typography>{bookingData.clientInfo.phone}</Typography></Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Booking Summary
                        </Typography>

                        <Stack spacing={1}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Hotel:</Typography>
                                <Typography fontWeight={600}>
                                    {bookingData.hotel.name || bookingData.hotel.hotelName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography fontWeight={600}>Rooms:</Typography>
                                {bookingData.rooms.map((room, index) => (
                                    <Box key={index} sx={{ pl: 2 }}>
                                        <Typography>• Room {index + 1}: {room.Description}</Typography>
                                        <Typography variant="caption">{room.RoomBasis}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6" color="primary">Total to Pay Now:</Typography>
                                <Typography variant="h6" color="primary" fontWeight={700}>
                                    {bookingData.rooms[0].Currency} {bookingData.totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button size="large" onClick={goBack} disabled={isSubmitting} sx={{ mr: 2 }}>
                        Back
                    </Button>
                    <Button variant="contained" size="large" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}

export default BookingReview;
