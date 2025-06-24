import { Paper, Stack, Typography, Box, Container, Grid, Card, CardContent, Fade, Chip } from "@mui/material"
import SearchBar from "../SearchHotelContext/SearchBar";
import React from "react";
import { keyframes } from '@mui/system';
import HotelIcon from '@mui/icons-material/Hotel';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const WelcomePage = () => {
    return (
        <React.Fragment>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '85vh',
                    backgroundColor: 'grey.800',
                    color: '#fff',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url("https://r-xx.bstatic.com/xdata/images/xphoto/2880x868/313564245.jpeg?k=c677d4c63f8a8218d275614559b8ccd5dc5f169b44667c3ff46328091c225b13&o=")`,

                }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Stack spacing={4}
                        alignItems={'center'}
                        sx={{
                            position: 'relative',
                            animation: `${fadeInUp} 1s ease-out`,
                            p: { xs: 3, md: 6 }
                        }}>
                        <Box sx={{
                            animation: `${float} 3s ease-in-out infinite`,
                            mb: 2
                        }}>
                            <HotelIcon sx={{
                                fontSize: 60,
                                color: 'white',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                            }} />
                        </Box>
                        <Typography component="h1" variant="h3" color="inherit"
                            sx={{
                                fontWeight: 'medium'
                            }}
                            gutterBottom>
                            A dream stay
                            for a bucket list trip
                        </Typography>
                        <Typography variant="h5" color="inherit">
                            Make it a trip to remember in a holiday home
                        </Typography>
                        <Box>
                            <SearchBar />
                        </Box>
                    </Stack>
                    <Paper sx={{
                        width: '70%', justifySelf: 'center', p: 3, textAlign: 'left', backgroundColor: 'grey.50',
                        animation: `${fadeInUp} 1s ease-out`
                    }}
                        elevation={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                            <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="h5" component="h3">
                                Admin Access
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }} gutterBottom >
                            To view the admin dashboard, please create your admin account first in the database following this format:
                        </Typography>
                        <Paper
                            sx={{
                                backgroundColor: 'grey.900',
                                color: 'white',
                                p: 3,
                                borderRadius: 2,
                                position: 'relative',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                overflow: 'auto'
                            }}
                        >
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify({
                                    email: "[adminEmail]",
                                    role: "admin",
                                    password: "[adminPassword]"
                                }, null, 2)}
                            </pre>
                        </Paper>
                    </Paper>
                </Container>
            </Box>
        </React.Fragment >);
};