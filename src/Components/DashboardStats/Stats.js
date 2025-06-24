import { Box, Card, CardContent, CircularProgress, Container, Grid, IconButton, Typography } from "@mui/material";
import StatsContext, { StatsContextProvider } from "./StatsContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HotelIcon from '@mui/icons-material/Hotel';
import PaymentIcon from '@mui/icons-material/Payment';
import dayjs from "dayjs";
import { Skeleton } from "@mui/material";

const today = dayjs();

function Stats() {
    const { stats } = useContext(StatsContext);
    const yesterday = today.subtract(1, 'day');
    const lastWeek = today.subtract(1, 'week');
    const lastMonth = today.subtract(1, 'month');

    var totalRevenue;
    var bookingToday;
    var bookingLastWeek;
    var bookingMonth;

    var yesterdayRevenue;
    var lastWeekRevenue;
    var lastMonthRevenue;

    if (!stats.isLoaded) {
        return (
            <Container sx={{ margin: "auto" }} maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid size={4}> <Skeleton variant="rectangular" height="10rem" width="100%" /></Grid>
                    <Grid size={4}> <Skeleton variant="rectangular" height="10rem" width="100%" /></Grid>
                    <Grid size={4}> <Skeleton variant="rectangular" height="10rem" width="100%" /></Grid>
                    <Grid size={4}> <Skeleton variant="rectangular" height="10rem" width="100%" /></Grid>
                </Grid>
            </Container>
        );
    } else {
        if (stats.hasOwnProperty("bookings")) {
            totalRevenue = stats.bookings.reduce((acc, booking) => acc + booking.totalPrice, 0); // calculate the sum of earnings
            // use booking time to minus the corresponding filter time, if > 0, meaning it's after that time 
            bookingToday = stats.bookings.filter(booking => dayjs(booking.time).diff(yesterday) > 0);
            bookingLastWeek = stats.bookings.filter(booking => dayjs(booking.time).diff(lastWeek) > 0);
            bookingMonth = stats.bookings.filter(booking => dayjs(booking.time).diff(lastMonth) > 0);

            // calculate the earnings of the filtered bookings
            yesterdayRevenue = bookingToday.reduce((acc, booking) => acc + booking.totalPrice, 0);
            lastWeekRevenue = bookingLastWeek.reduce((acc, booking) => acc + booking.totalPrice, 0);
            lastMonthRevenue = bookingMonth.reduce((acc, booking) => acc + booking.totalPrice, 0);
        }

        return (<Container sx={{ margin: "auto" }} maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                USERS
                            </Typography>
                            <Typography variant="h5" color="primary">{stats.hasOwnProperty("users") ? stats.users.length : 0}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <Link to="/Dashboard/ManageUsers">Manager Users</Link>
                                <IconButton component={Link} to="/Dashboard/ManageUsers"><SupervisedUserCircleIcon sx={{ "&:hover": { color: (theme) => theme.palette.primary.main } }} /></IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                HOTELS
                            </Typography>
                            <Typography variant="h5" color="primary">{stats.hasOwnProperty("hotels") ? stats.hotels.length : 0}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <Link to="/Dashboard/ManageHotels">Manage Hotels</Link>
                                <IconButton component={Link} to="/Dashboard/ManageHotels"><HotelIcon sx={{ "&:hover": { color: (theme) => theme.palette.primary.main } }} /></IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                BOOKINGS
                            </Typography>
                            <Typography variant="h5" color="primary">{stats.hasOwnProperty("bookings") ? stats.bookings.length : 0}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <Link to="/Dashboard/ViewBookings">View Bookings</Link>
                                <IconButton component={Link} to="/Dashboard/ViewBookings"><PaymentIcon sx={{ "&:hover": { color: (theme) => theme.palette.primary.main } }} /></IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', }}>
                            <Typography color="textSecondary" gutterBottom>
                                EARNINGS
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5">Total Earnings</Typography>
                                <Typography variant="h5" color="primary">${stats.hasOwnProperty("bookings") ? totalRevenue.toFixed(2) : 0}</Typography>
                            </Box>

                            <Grid container spacing={2} >
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">Last 24 Hours</Typography>
                                    <Typography variant="h6" color="primary">${stats.hasOwnProperty("bookings") ? yesterdayRevenue.toFixed(2) : 0}</Typography>
                                </Grid>
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">Last Week</Typography>
                                    <Typography variant="h6" color="primary">${stats.hasOwnProperty("bookings") ? lastWeekRevenue.toFixed(2) : 0}</Typography>
                                </Grid>
                                <Grid size={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">Last Month</Typography>
                                    <Typography variant="h6" color="primary">${stats.hasOwnProperty("bookings") ? lastMonthRevenue.toFixed(2) : 0}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>);
    }
}

export default Stats;