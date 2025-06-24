import { Button, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useReward } from 'react-rewards';
import { useEffect } from 'react';

function BookingSuccess() {
    const role = useSelector(state => state.auth.role);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const { reward } = useReward('rewardId', 'confetti');

    useEffect(() => {
        reward();
    }, [reward]);

    return (
        <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', margin: "auto", p: 5, width: "40%", textAlign: "center", alignItems: 'center', gap: 2, maxWidth: '30rem' }}>
            <Typography variant="h4" id="rewardId">Booked Successfully!</Typography>
            <Typography variant="h5" color="text.secondary">We have sent a confirmation to your email.</Typography>
            {isAuthenticated && role === 'user' && <Button component={Link} variant="contained" size="large" to="/Bookings">View my bookings</Button>}
            <Button sx={{ maxWidth: '12rem', mt: 2 }} component={Link} size="large" variant="contained" to="/">Go to Home Page</Button>
        </Paper>
    );
}

export default BookingSuccess;