import AppBar from '@mui/material/AppBar';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem } from '@mui/material';
import LoginAndRegisterForm from '../LoginAndRegister/LoginRegisterForm';
import { userLogout } from '../../helpers/authentication';
import HotelIcon from '@mui/icons-material/Hotel';

function MainHeader() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        dispatch(logout());
        await userLogout();
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ width: '100%' }} >
            <AppBar position="static">
                {/* use Grid to center the logo text,  */}
                <Toolbar sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    px: 2
                }}>
                    {/* Empty Box to reserve left space */}
                    <Box />
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease-in-out',
                        }
                    }}>
                        {/* Logo in the center of the header */}
                        <HotelIcon sx={{ fontSize: 32, color: 'white' }} />
                        <Typography component={Link}
                            to="/"
                            variant="h4"
                            color="inherit"
                            noWrap
                            sx={{
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                justifySelf: 'center' // the key to center the logo text
                            }}>
                            SimpliiBook
                        </Typography>
                    </Box>
                    {/*display buttons on the right side of the header */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {!isAuthenticated ?
                            (<>
                                <Button color="inherit" variant="outlined" onClick={handleDialogOpen}>Register</Button>
                                <Button color="inherit" variant="outlined" onClick={handleDialogOpen}>Login</Button>
                            </>) : (
                                <>
                                    {role === 'admin' && <Button color="inherit" component={Link} to="/Dashboard" variant="outlined">Dashboard</Button>}
                                    <div>
                                        <IconButton id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick} color="inherit"><AccountCircleIcon /></IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            {role === 'user' && <MenuItem component={Link} to="/UserProfile">Profile</MenuItem>}
                                            {role === 'user' && <MenuItem component={Link} to="/Bookings">My bookings</MenuItem>}
                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </>
                            )
                        }
                    </Box>
                </Toolbar>
            </AppBar >
            <LoginAndRegisterForm open={openDialog} onClose={handleDialogClose} />
        </Box >);
}

export default MainHeader;