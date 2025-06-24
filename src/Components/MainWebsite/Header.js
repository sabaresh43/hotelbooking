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
import appLogo from '../../assets/appLogo.png'; // adjust the path based on your file structure

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
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
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
                          <img src={appLogo} alt="App Logo" style={{ width: 140, height: 'auto', objectFit: 'contain' ,cursor: 'pointer'}} />
     
    </Link>
                    </Box>

                    {/* Buttons on the right */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {!isAuthenticated ? (
                            <>
                                <Button color="primary" variant="outlined" onClick={handleDialogOpen}>Register</Button>
                                <Button color="primary" variant="outlined" onClick={handleDialogOpen}>Login</Button>
                            </>
                        ) : (
                            <>
                                {role === 'admin' && (
                                    <Button color="primary" component={Link} to="/Dashboard" variant="outlined">
                                        Dashboard
                                    </Button>
                                )}
                                <IconButton
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    color="primary"
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                >
                                    {role === 'user' && <MenuItem component={Link} to="/UserProfile">Profile</MenuItem>}
                                    {role === 'user' && <MenuItem component={Link} to="/Bookings">My Bookings</MenuItem>}
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>


            <LoginAndRegisterForm open={openDialog} onClose={handleDialogClose} />
        </Box >);
}

export default MainHeader;