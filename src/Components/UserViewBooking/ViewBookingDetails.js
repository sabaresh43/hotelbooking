import { Box, Button, Card, CardContent, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material"
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from "dayjs";
import { useMediaQuery, useTheme } from "@mui/material";

function ViewBookingDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));


    const goBack = () => {
        navigate(-1);
    }

    return (
        <Container sx={{ mt: 5, mx: 'auto', display: "flex", flexDirection: 'row', justifyContent: "center", gap: 2 }}>
            <Stack direction="column" spacing={2}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary">
                            Hotel Info
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {location.state.bookingDetails.hotel.HotelName}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationOnIcon color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {location.state.bookingDetails.hotel.Address
                                    ? `${location.state.bookingDetails.hotel.Address.StreetAddress}, ${location.state.bookingDetails.hotel.Address.City}, ${location.state.bookingDetails.hotel.Address.StateProvince}, ${location.state.bookingDetails.hotel.Address.PostalCode}, ${location.state.bookingDetails.hotel.Address.Country}`
                                    : 'Address not available'}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Booking Details</Typography>
                        <Stack direction={{ xs: 'column', lg: 'row' }} alignItems="flex-start" spacing={2} divider={<Divider orientation={isLgUp ? "vertical" : 'horizontal'} flexItem />}>
                            <Box>
                                <Typography color="text.secondary">Check-in</Typography>
                                <Typography variant="subtitle1">{dayjs(location.state.bookingDetails.from).format('dddd, MMMM D, YYYY')}</Typography>
                                <Typography variant="body2">From 16:00</Typography>
                            </Box>
                            <Box>
                                <Typography color="text.secondary">Check-out</Typography>
                                <Typography variant="subtitle1">{dayjs(location.state.bookingDetails.to).format('dddd, MMMM D, YYYY')}</Typography>
                                <Typography variant="body2">Until 12:00</Typography>
                            </Box>
                        </Stack>
                        <Typography color="text.secondary" mt={2}>Total length of stay:</Typography>
                        <Typography variant="body1">{location.state.bookingDetails.duration} {location.state.bookingDetails.duration > 1 ? "nights" : "night"}</Typography>
                        <Typography color="text.secondary" mt={1}>You selected</Typography>
                        <Typography variant="body1">{location.state.bookingDetails.rooms.length} {location.state.bookingDetails.rooms.length > 1 ? "rooms" : "room"} for {location.state.bookingDetails.numberOfGuest} {location.state.bookingDetails.numberOfGuest > 1 ? "guests" : "guest"}</Typography>
                        {location.state.bookingDetails.rooms.map((room) => (
                            <Typography key={room.RoomId} variant="body2" mt={0.5}>{room.Description}</Typography>
                        ))}
                    </CardContent>
                </Card>
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Price Summary</Typography>
                        <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: { md: "space-between" }, bgcolor: "primary.main", color: "common.white", p: 2, borderRadius: 1 }}>
                            <Typography variant="h5">Price</Typography>
                            <Typography variant="h5">CAD {location.state.bookingDetails.totalPrice.toFixed(2)}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
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
                                    {location.state.bookingDetails.clientInfo.firstName}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    Last Name
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    {location.state.bookingDetails.clientInfo.lastName}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    Email
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    {location.state.bookingDetails.clientInfo.email}
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1">
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid size={6} >
                                <Typography variant="body1" >
                                    {location.state.bookingDetails.clientInfo.phone}
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
                                    {location.state.bookingDetails.cardInfo.address.street}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {location.state.bookingDetails.cardInfo.address.city}, {location.state.bookingDetails.cardInfo.address.province}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {location.state.bookingDetails.cardInfo.address.postalCode}, {location.state.bookingDetails.cardInfo.address.country.toUpperCase()}
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
                                            {location.state.bookingDetails.cardInfo.cardName}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            Card Number
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            {"xxxx-xxxx-xxxx-" + location.state.bookingDetails.cardInfo.cardNumber.slice(-4)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            Expiry Date
                                        </Typography>
                                    </Grid>
                                    <Grid size={6} >
                                        <Typography variant="body1" gutterBottom>
                                            {`${location.state.bookingDetails.cardInfo.expDate.substring(0, 2)}/${location.state.bookingDetails.cardInfo.expDate.substring(2)}`}
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
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: 'flex-end', fontSize: 16 }}  // Align the button to the end of the flex container
                    >
                        Back
                    </Button>
                </Box>

            </Stack>
        </Container>
    )
}

export default ViewBookingDetails;