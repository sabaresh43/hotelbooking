import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Instagram, Facebook, Twitter, LinkedIn } from "@mui/icons-material";

export default function Footer() {

    return (
        <Box component="footer" sx={{
            width: '100%',
            bgcolor: 'grey.900', color: 'grey.50', height: '20%',
            mt: 'auto', bottom: 0
        }}>
            <Container maxWidth="lg" sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            SimpliiBook
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            A dream stay for a bucket list trip
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="large" sx={{ color: 'grey.50' }}>
                                <Instagram />
                            </IconButton>
                            <IconButton size="large" sx={{ color: 'grey.50' }}>
                                <Facebook />
                            </IconButton>
                            <IconButton size="large" sx={{ color: 'grey.50' }}>
                                <Twitter />
                            </IconButton>
                            <IconButton size="large" sx={{ color: 'grey.50' }} >
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }} >
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Support
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                            {['Help Centre', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report concerns'].map((item, index) =>
                            (
                                <Box component="li" key={item} mb={1}>
                                    <Typography component="a" href="#" sx={{ textDecoration: 'none', color: 'grey.50', }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))
                            }
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }} >
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Terms and settings
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                            {['Privacy & cookies', 'Terms & conditions', 'Partner dispute'].map((item, index) =>
                            (
                                <Box component="li" key={item} mb={1}>
                                    <Typography component="a" href="#" sx={{ textDecoration: 'none', color: 'grey.50', }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))
                            }
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }} >
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            About
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                            {['About SimpliiBook', 'Contact us', 'Careers', 'Missions'].map((item, index) =>
                            (
                                <Box component="li" key={item} mb={1}>
                                    <Typography component="a" href="#" sx={{ textDecoration: 'none', color: 'grey.50', }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box >
    );
}