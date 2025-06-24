import {
    Container, Typography, Box, TextField, Button, Stack, IconButton, FormControl, Paper, useMediaQuery,
    useTheme,
    InputAdornment,
} from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import SearchContext from "./SearchContext";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import Grid from '@mui/material/Grid';

const today = dayjs();

function SearchBar() {
    const { searchOption, setSearchOption } = useContext(SearchContext);
    const [minDate, setMinDate] = useState(today.add(1, 'day'));
    const theme = useTheme();

    // Use MUI's useMediaQuery hook for responsive breakpoints
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isMd = useMediaQuery(theme.breakpoints.down('lg'));

    const handleChange = (event) => {
        setSearchOption({ ...searchOption, [event.target.name]: event.target.value });
    };

    const handleIncrease = () => {
        setSearchOption((prevState) => ({
            ...prevState,
            numberOfGuest: prevState.numberOfGuest + 1,
        }));
    };

    const handleDecrease = () => {
        if (searchOption.numberOfGuest <= 1) {
            return;
        }
        setSearchOption((prevState) => ({
            ...prevState,
            numberOfGuest: Math.max(1, prevState.numberOfGuest - 1),
        }));
    };

    useEffect(() => {
        if (searchOption.from) {
            setMinDate(dayjs(searchOption.from).add(1, "day"));
        }
    }, [searchOption.from])

    return (
        <Grid container columns={{ xs: 12, md: 15 }}
            spacing={2}
            maxWidth="md"
            sx={{ backgroundColor: "white", p: { xs: 1.5, sm: 2 }, borderRadius: 2, boxShadow: 3, alignItems: 'center' }}>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    required
                    id="location"
                    label="City"
                    name="location"
                    value={searchOption.location || "Toronto"}
                    onChange={handleChange}
                    sx={{ backgroundColor: 'white', width: '100%' }} // Responsive margin-top for different screen sizes
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start" >
                                    <LocationOnIcon color="primary" />
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
                <Stack
                    direction="row"
                    spacing={1}
                >
                    <IconButton
                        onClick={handleDecrease} disabled={searchOption.numberOfGuests <= 1}
                        size={isXs ? "small" : "medium"}> {/* Button size changes based on extra small screen detection */}
                        <RemoveIcon />
                    </IconButton>
                    <TextField
                        id="numberOfGuest"
                        value={searchOption.numberOfGuest}
                        label="Guest Each Room"
                        sx={{ width: '100%' }}
                        slotProps={{
                            input: {
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start" >
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    {/* Button size changes based on extra small screen detection */}
                    <IconButton onClick={handleIncrease} size={isXs ? "small" : "medium"}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Grid>


            {/* Stack direction changes based on screen size - column on mobile, row on desktop */}
            <Grid size={{ xs: 6, md: 3 }}>
                <DatePicker margin="normal"
                    id="from"
                    label="From"
                    autoComplete="from"
                    value={searchOption.from}
                    onChange={(newValue) => setSearchOption({ ...searchOption, "from": newValue })}
                    sx={{ backgroundColor: 'white', width: '100%' }} // DatePicker width changes based on screen size - full width on mobile, half width on desktop
                    minDate={today}
                    inputFormat="YYYY-MM-DD" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <DatePicker margin="normal"
                    id="to"
                    label="To"
                    autoComplete="to"
                    value={searchOption.to}
                    onChange={(newValue) => setSearchOption({ ...searchOption, "to": newValue })}
                    sx={{ backgroundColor: 'white', width: '100%' }} // DatePicker width changes based on screen size - full width on mobile, half width on desktop
                    minDate={minDate}
                    inputFormat="YYYY-MM-DD"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
                <Button
                    type="submit"
                    component={Link}
                    to="/Hotels"
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' },
                        width: '100%',
                        minHeight: { xs: '3em', md: '3.5em' }
                    }}
                >
                    Search
                </Button>
            </Grid>
        </Grid >);
};

export default SearchBar;