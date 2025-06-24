import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { Button, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HotelIcon from '@mui/icons-material/Hotel';
import PaymentIcon from '@mui/icons-material/Payment';
import KeyIcon from '@mui/icons-material/Key';
import { Link, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import ChangePassword from './ChangePassword';
import ManagerUsers from './ManageUsers/ManageUsers';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HomeIcon from '@mui/icons-material/Home';
import ManageHotels from './ManageHotels/ManageHotels';
import AdminViewBookings from './AdminViewBookings/AdminViewBookings';
import Stats from './DashboardStats/Stats';
import { StatsContextProvider } from './DashboardStats/StatsContext';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { userLogout } from '../helpers/authentication.js'; // import the userLogout function

const drawerWidth = "15%";

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })( // do not forward the open prop to the DOM element
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}`, // when the drawer is closed, shift the content to the left
        variants: [
            {
                props: ({ open }) => open, // only apply this style if open is true
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0, // when drawer is open, no margin shift
                },
            },
        ],
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth})`, // when the drawer is open, set the width to 100% minus the drawer width
                marginLeft: `${drawerWidth}`, // when the drawer is open, shift the content to the right by the drawer width
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const Dashboard = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        dispatch(logout());
        await userLogout();
    };

    return (<Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                        { mr: 2 },
                        open && { display: 'none' }, // hide the menu button when the drawer is open
                    ]}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }} // make the title grow to fill the space
                >
                    Dashboard
                </Typography>
                {isAuthenticated && <Button color="inherit" variant="outlined" sx={{ mr: 2 }} onClick={handleLogout}>Logout</Button>}
            </Toolbar>
        </AppBar >
        <Drawer
            sx={{
                width: drawerWidth, // set the width of the drawer
                flexShrink: 0, // do not allow the drawer to shrink
                '& .MuiDrawer-paper': {
                    width: drawerWidth, // set the width of the drawer paper
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Navigation
                </ListSubheader>
            }>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Home Page" />
                </ListItemButton>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard">
                        <ListItemIcon>
                            <DashboardIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Data
                </ListSubheader>
            }>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard/ManageUsers">
                        <ListItemIcon>
                            <SupervisedUserCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Manage Users" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard/ManageHotels">
                        <ListItemIcon>
                            <HotelIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Manage Hotels" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard/ViewBookings">
                        <ListItemIcon>
                            <PaymentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="View Bookings" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard">
                        <ListItemIcon>
                            <ShowChartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="View Status" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    User
                </ListSubheader>
            }>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/Dashboard/ChangePassword">
                        <ListItemIcon>
                            <KeyIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Change Password" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
        <Main open={open}>
            {/* This is the space between the AppBar and the DrawerHeader, which is the space where the content will be displayed */}
            <DrawerHeader />
            <Routes>
                <Route index element={<StatsContextProvider><Stats /></StatsContextProvider>} />
                <Route path="ManageUsers" element={<ManagerUsers />} />
                <Route path="ManageHotels/*" element={<ManageHotels />} />
                <Route path="ViewBookings/*" element={<AdminViewBookings />} />
                <Route path="ChangePassword" element={<ChangePassword />} />
            </Routes>
        </Main>
    </Box>);
};

