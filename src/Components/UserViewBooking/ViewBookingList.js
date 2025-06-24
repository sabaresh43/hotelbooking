import { useContext } from "react";
import UserViewBookingContext from "./UserViewBookingContext";
import { Button, Card, CardContent, CircularProgress, Container, Typography, Grid, Box } from "@mui/material";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

function ViewBookingList() {
    const { bookingList } = useContext(UserViewBookingContext);
    const navigate = useNavigate();

    const checkBookingDetails = (bookingId) => {
        // find the booking record
        const booking = bookingList.bookings.find(booking => booking._id === bookingId);
        // prepare corresponding hotel data
        const hotelData = bookingList.hotels.find(hotel => hotel._id === booking.hotel);
        // find the rooms data
        const roomsData = hotelData.Rooms.filter(room => booking.rooms.includes(room.RoomId));
        // delete room data from the hotel Data to save space
        const { Rooms, ...pureHotelData } = hotelData;
        navigate(`/Bookings/${bookingId}`, {
            state: {
                bookingDetails: {
                    ...booking,
                    hotel: pureHotelData,
                    rooms: roomsData
                }
            }
        });
    }

    // only render when the data is ready
    if (!bookingList.isLoaded) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ mt: 5, mx: 'auto' }}>
                <CircularProgress />
            </Box>
        );
    } else {
        if (bookingList.bookings.length === 0) {
            return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ mt: 5, mx: 'auto' }}>
                <Typography variant="h4">It seems you don't have any booking yet.</Typography>
            </Box>);
        } else {
            return (
                <Container sx={{ margin: "auto", mt: 3 }}>
                    <Typography variant="h3" sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        my: 2
                    }}>
                        My Bookings
                    </Typography>
                    <Grid container rowSpacing={2} columnSpacing={5} sx={{ mt: 3, alignItems: "center", justifyContent: "center" }}>
                        {bookingList.bookings.map((booking) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking._id}>
                                <Card sx={{ ":hover": { boxShadow: 6 }, boxShadow: 3, pt: 1 }}>
                                    <CardContent sx={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'flex-start', alignContent: 'center', width: '80%', mx: 'auto',
                                        gap: 0.5
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Booking ID: {booking._id}
                                        </Typography>
                                        <Typography variant="h6">
                                            {bookingList.hotels.find(hotel => hotel._id === booking.hotel).HotelName}
                                        </Typography>
                                        <Typography variant="body1">
                                            Check in: {dayjs(booking.from).format('MMMM D, YYYY')} 16:00
                                            <br></br>
                                            Check out: {dayjs(booking.to).format('MMMM D, YYYY')} 12:00
                                        </Typography>
                                        <Typography variant="body1" color="primary">
                                            CAD {booking.totalPrice.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Booked created at {dayjs(booking.time).format('dddd, MMMM D, YYYY')}
                                        </Typography>
                                        <Button variant="contained" onClick={() => { checkBookingDetails(booking._id) }}
                                            sx={{ mt: 1 }}>
                                            View details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            );
        }
    }
}

export default ViewBookingList;
