import { useContext } from "react";
import UserProfileContext from "./UserProfileContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';

function UserProfileDetails() {
    const { userProfile } = useContext(UserProfileContext);

    if (!userProfile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    } else {
        return (<Grid container spacing={2} sx={{ m: 2 }}>
            <Grid size={12}><Typography component="h1" variant="h5" gutterBottom >
                Account Details
            </Typography>
            </Grid>
            <Grid size={5}>
                <Typography>
                    User ID
                </Typography>
            </Grid>
            <Grid size={7}>
                <Typography sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {userProfile._id}
                </Typography>
            </Grid>
            <Grid size={5}>
                <Typography>
                    Email
                </Typography>
            </Grid>
            <Grid size={7} sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
                <Typography>
                    {userProfile.email}
                </Typography>
            </Grid>
        </Grid>);
    }
}

export default UserProfileDetails;