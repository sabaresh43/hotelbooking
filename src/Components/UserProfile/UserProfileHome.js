import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Toolbar, Typography } from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import { Link, Route, Routes } from "react-router-dom";
import ChangePassword from "../ChangePassword";
import UserProfileDetails from "./UserProfileDetails";
import { UserProfileContextProvider } from "./UserProfileContext";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { FormProvider, useForm } from "react-hook-form";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UserProfileClientInfo from "./UserProfileClientInfo";
import UserProfileCardInfo from "./UserProfileCardInfo";

function UserProfileHome() {
    const methods = useForm({
        defaultValues: {
            clientInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            },
            cardInfo: {
                cardName: '',
                cardNumber: '',
                expDate: '',
                cvv: '',
                address: {
                    street: '',
                    city: '',
                    province: '',
                    country: ''
                }
            }
        }
    });


    return (
        <UserProfileContextProvider>
            <FormProvider {...methods}>
                <Stack direction="row" spacing={3} sx={{ margin: "auto", my: 3, width: "80%", justifyContent: "center" }}>
                    <Paper elevation={3} sx={{ height: '20%' }}>
                        <List>
                            <ListItem>
                                <ListItemButton component={Link} to="/UserProfile">
                                    <ListItemText primary="Account Info"
                                        sx={{ my: 0 }}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontSize: '1.25em',
                                                    fontWeight: '500'
                                                }
                                            }
                                        }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/UserProfile/ClientInfo">
                                    <ListItemIcon>
                                        <AccountBoxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Client Info" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/UserProfile/CardInfo">
                                    <ListItemIcon>
                                        <CreditCardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Card Info" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/UserProfile/ChangePassword">
                                    <ListItemIcon>
                                        <KeyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Change Password" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, maxWidth: "40%" }}>
                        <Routes>
                            <Route index element={<UserProfileDetails />} />
                            <Route path="ChangePassword" element={<ChangePassword />} />
                            <Route path="ClientInfo" element={<UserProfileClientInfo />} />
                            <Route path="CardInfo" element={<UserProfileCardInfo />} />
                        </Routes>
                    </Paper>
                </Stack>
            </FormProvider>
        </UserProfileContextProvider>);
}

export default UserProfileHome;