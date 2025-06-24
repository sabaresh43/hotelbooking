import { Container, Divider, Fab, Grid, Paper, Stack, Typography } from "@mui/material"
import React, { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AdminViewBookingDetails() {
    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        navigate(-1);
    }

    return (<Container>
        <Paper sx={{ p: 5, m: 3 }} elevation={3}>
            <Grid container spacing={2}>
                <Grid container>
                    <Grid size={12}>
                        <Typography variant="h5" gutterBottom>Basic Info</Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Booking Id</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails._id}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Booked At</Typography></Grid>
                    <Grid size={6} variant="body1">
                        <Typography>{dayjs(location.state.bookingDetails.time).format('MMM D, YYYY h:mm A')}</Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Booking User Id:</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.userId}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Booking User Email:</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.userEmail}</Typography></Grid>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid container>
                    <Grid size={12}>
                        <Typography variant="h5" gutterBottom>Hotel Info</Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Hotel Id</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.hotel._id}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Hotel Name</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.hotel.HotelName}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Hotel Address</Typography></Grid>
                    <Grid size={6} variant="body1">
                        <Typography>
                            {location.state.bookingDetails.hotel.Address
                                ? `${location.state.bookingDetails.hotel.Address.StreetAddress}, ${location.state.bookingDetails.hotel.Address.City}, ${location.state.bookingDetails.hotel.Address.StateProvince}, ${location.state.bookingDetails.hotel.Address.PostalCode}, ${location.state.bookingDetails.hotel.Address.Country}`
                                : 'Address not available'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                {/* Booking Details */}
                <Grid container>
                    <Grid size={12}>
                        <Typography variant="h5" gutterBottom>Your Booking Details</Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Check-in</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{dayjs(location.state.bookingDetails.from).format('dddd, MMMM D, YYYY')} 16:00</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Check-out</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{dayjs(location.state.bookingDetails.to).format('dddd, MMMM D, YYYY')} 12:00</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Total Length of Stay</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.duration} {location.state.bookingDetails.duration > 1 ? "nights" : "night"}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>You Selected</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>
                        {location.state.bookingDetails.rooms.length} {location.state.bookingDetails.rooms.length > 1 ? "rooms" : "room"} for {location.state.bookingDetails.numberOfGuest} {location.state.bookingDetails.numberOfGuest > 1 ? "guests" : "guest"}
                    </Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Room Selections</Typography></Grid>
                    <Grid size={6}>
                        <Typography>
                            {location.state.bookingDetails.rooms.map((room) => (
                                <Typography key={room.RoomId} mt={0.5}>
                                    {room.Description}
                                </Typography>
                            ))}
                        </Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Total Price</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>$ {location.state.bookingDetails.totalPrice}</Typography></Grid>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                {/* Personal Details */}
                <Grid container size={12}>
                    <Grid size={12} variant="body1">
                        <Typography variant="h5" gutterBottom>
                            Personal Details
                        </Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>First Name</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.clientInfo.firstName}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Last Name</Typography></Grid>
                    <Grid size={6} variant="body1">
                        <Typography>{location.state.bookingDetails.clientInfo.lastName}</Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Email</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.clientInfo.email}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Phone</Typography></Grid>
                    <Grid size={6} variant="body1">
                        <Typography>{location.state.bookingDetails.clientInfo.phone}</Typography>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid container size={12}>
                    <Grid size={6}>
                        <Typography variant="h5" gutterBottom>
                            Billing Address
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>{location.state.bookingDetails.cardInfo.address.street}</Typography>
                        <Typography>{location.state.bookingDetails.cardInfo.address.city}, {location.state.bookingDetails.cardInfo.address.province}</Typography>
                        <Typography>{location.state.bookingDetails.cardInfo.address.postalCode}, {location.state.bookingDetails.cardInfo.address.country.toUpperCase()}</Typography>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid container size={12}>
                    <Grid size={12}>
                        <Typography variant="h5" gutterBottom>
                            Payment Details
                        </Typography>
                    </Grid>
                    <Grid size={6} variant="body1"><Typography>Card Holder Name</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{location.state.bookingDetails.cardInfo.cardName}</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>Card Number</Typography></Grid>
                    <Grid size={6} variant="body1"><Typography>{"xxxx-xxxx-xxxx-" + location.state.bookingDetails.cardInfo.cardNumber.slice(-4)}</Typography></Grid>
                </Grid>
            </Grid>
        </Paper><div style={{ position: 'fixed', bottom: 100, right: 70 }}>
            <Fab color="primary" aria-label="add" size="large" onClick={goBack} variant="extended">
                <ArrowBackIcon />
                Back
            </Fab>
        </div>
    </Container >
    );

}

export default AdminViewBookingDetails;