import { Box, Card, CardContent, Divider, Grid, Stack, Typography, Container, Button, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import BookingContext from "./BookingContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { createBooking } from "../../helpers/bookings";;

function BookingReview({ prevStep }) {
    const { bookingData, dispatch } = useContext(BookingContext);
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const navigate = useNavigate();
    const [bookingDetail, setBookingDetail] = useState(null);
    const [isBookingFailed, setIsBookingFailed] = useState(false);

    const goBack = () => {
        prevStep();
        navigate(-1);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // if log in, save the user id
        // save order time
        // save only hotel Id and room Id
        const roomIdList = bookingData.rooms.map(room => room.RoomId);
        const hotelId = bookingData.hotel._id;

        setBookingDetail({
            ...bookingData,
            hotel: hotelId,
            rooms: roomIdList,
            userId: sessionKey || '',
            time: dayjs()
        });

        if (bookingDetail) {
            const { isBookingSuccess, ...pureBookingData } = bookingDetail;
            const isBookingCreated = await createBooking(pureBookingData);

            if (isBookingCreated) {
                dispatch({ type: "setIsBookingSuccess" }); // make the order details not visible
                navigate("../success");
            } else {
                dispatch({ type: "setIsBookingFailed" });
                setIsBookingFailed(true); // set the alert to visible
            }
        } else {
            setIsBookingFailed(true); // set the alert to visible
            return;
        }
    }

    return (
        <Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <Card sx={{ boxShadow: 3, px: 1 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Personal Details
                        </Typography>
                        <Grid container columnSpacing={0} rowSpacing={1}>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    First Name
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    {bookingData.clientInfo.firstName}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    Last Name
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    {bookingData.clientInfo.lastName}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    Email
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    {bookingData.clientInfo.email}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
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
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            Card Holder Name
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            {bookingData.cardInfo.cardName}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            Card Number
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            {"xxxx-xxxx-xxxx-" + bookingData.cardInfo.cardNumber.slice(-4)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            Expiry Date
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            {`${bookingData.cardInfo.expDate.substring(0, 2)}/${bookingData.cardInfo.expDate.substring(2)}`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Use flexbox to align the button */}
                    <Button
                        size="large"
                        onClick={goBack}
                        color="primary"
                        sx={{ mr: 2, alignSelf: 'flex-end' }}  // Align the button to the end of the flex container
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained" size="large"
                        onClick={handleSubmit}
                        color="primary"
                        sx={{ alignSelf: 'flex-end' }}  // Align the button to the end of the flex container
                    >
                        Confirm
                    </Button>
                </Box>
                {isBookingFailed && <Alert severity="error">"Something went wrong, please try again"</Alert>}
            </Stack>
        </Container>
    );
}

export default BookingReview;
