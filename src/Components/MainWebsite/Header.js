import AppBar from '@mui/material/AppBar';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem } from '@mui/material';
import LoginAndRegisterForm from '../LoginAndRegister/LoginRegisterForm';
import { userLogout } from '../../helpers/authentication';
import HotelIcon from '@mui/icons-material/Hotel';
import appLogo from '../../assets/appLogo.png'; // adjust the path based on your file structure
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { stopTimer } from '../../features/timerSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainHeader() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const employeeId = useSelector(state => state.auth.employeeId);
    const dispatch = useDispatch();
    const location = useLocation();

    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Timer Logic
    const timer = useSelector(state => state.timer);
    const { endTime, isVisible, hotelId } = timer;
    const [timeLeft, setTimeLeft] = useState(null);
    const [openExpiryDialog, setOpenExpiryDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVisible || !endTime) {
            setTimeLeft(null);
            return;
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                setTimeLeft("00:00");
                if (!openExpiryDialog && isVisible) {
                    setOpenExpiryDialog(true);
                }
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        // Initial call
        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [endTime, isVisible, openExpiryDialog]);

    // ✅ Stop timer if navigated away from booking flow
    useEffect(() => {
        if (isVisible && !location.pathname.includes('/booking')) {
            dispatch(stopTimer());
        }
    }, [location.pathname, isVisible, dispatch]);

    const handleExpiryOk = () => {
        dispatch(stopTimer());
        setOpenExpiryDialog(false);
        if (hotelId) {
            navigate(`/Hotels/${hotelId}`);
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ backgroundColor: '#062a4eff', boxShadow: 1 }}>
                <Toolbar sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    px: 2,
                    minHeight: 64
                }}>
                    {/* Empty Box to reserve left space */}
                    <Box />

                    {/* Centered Logo */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease-in-out',
                        }
                    }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={appLogo}
                                alt="App Logo"
                                style={{
                                    width: 140,
                                    height: 'auto',
                                    objectFit: 'contain',
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    </Box>

                    {/* Buttons on the right */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* Timer Display */}
                        {isVisible && timeLeft && (
                            <Box sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                mr: 2,
                                fontWeight: 'bold'
                            }}>
                                Time Left: {timeLeft}
                            </Box>
                        )}

                        {!isAuthenticated ? (
                            <Button
                                color="inherit"
                                variant="outlined"
                                onClick={handleDialogOpen}
                                sx={{ color: '#fff', borderColor: '#fff' }}
                            >
                                Login
                            </Button>
                        ) : (
                            <>
                                {/* ✅ Show employee ID */}
                                <Box sx={{
                                    color: '#fff',
                                    mr: 2,
                                    display: { xs: 'none', sm: 'block' },
                                    fontSize: '0.9rem'
                                }}>
                                    {employeeId}
                                </Box>

                                <IconButton
                                    id="user-menu-button"
                                    aria-controls={open ? 'user-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <AccountCircleIcon sx={{ color: '#fff', fontSize: 32 }} />
                                </IconButton>

                                <Menu
                                    id="user-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{ 'aria-labelledby': 'user-menu-button' }}
                                >
                                    {/* ✅ My Bookings */}
                                    <MenuItem component={Link} to="/Bookings" onClick={handleClose}>
                                        My Bookings
                                    </MenuItem>

                                    {/* ✅ Logout */}
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <LoginAndRegisterForm open={openDialog} onClose={handleDialogClose} />

            {/* Timer Expiry Dialog */}
            <Dialog
                open={openExpiryDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        // Prevent closing by clicking outside
                        // But user might want to inspect? 
                        // Request said "onclik, redirect". So we should force click.
                        // I will keep it simple.
                    }
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Session Expired"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Rates have changed please recheck the rooms.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExpiryOk} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MainHeader;