import {
    TextField, Button, Stack, IconButton, useMediaQuery,
    useTheme,
    InputAdornment,
} from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import SearchContext from "./SearchContext";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import Grid from '@mui/material/Grid';
import { Autocomplete } from "@mui/material";


function SearchBar() {
    const navigate = useNavigate();
    const { searchOption, setSearchOption } = useContext(SearchContext);
    const [minDate, setMinDate] = useState(dayjs().add(1, 'day'));
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (searchOption.from) {
            setMinDate(dayjs(searchOption.from).add(1, "day"));
        }
    }, [searchOption.from]);

    const handleCityChange = (event, newValue) => {
        const cities = [
            { label: "Chennai", code: "1175" },
            { label: "Delhi", code: "514" },
            { label: "Bengaluru", code: "234" },
        ];
        
        const selectedCity = cities.find(c => c.label === newValue);
        setSearchOption({
            ...searchOption,
            location: selectedCity ? selectedCity.label : newValue,
            cityCode: selectedCity ? selectedCity.code : null
        });
    };

    const handleIncrease = () => {
        setSearchOption(prev => ({ ...prev, numberOfGuest: prev.numberOfGuest + 1 }));
    };

    const handleDecrease = () => {
        if (searchOption.numberOfGuest > 1) {
            setSearchOption(prev => ({ ...prev, numberOfGuest: prev.numberOfGuest - 1 }));
        }
    };

    const handleSearch = () => {
        // ✅ Validate before navigation
        if (!searchOption.location && !searchOption.cityCode) {
            alert('Please select a city');
            return;
        }
        
        if (!searchOption.from || !searchOption.to) {
            alert('Please select dates');
            return;
        }

        // ✅ Format dates as strings for navigation
        const formattedSearchOption = {
            ...searchOption,
            from: searchOption.from.format('YYYY-MM-DD'),
            to: searchOption.to.format('YYYY-MM-DD'),
        };
        
        console.log("Searching with:", formattedSearchOption);
        
        navigate('/hotels', { state: { searchOption: formattedSearchOption } });
    };

    return (
        <Grid
            container
            columns={{ xs: 12, md: 15 }}
            spacing={2}
            maxWidth="md"
            sx={{
                backgroundColor: "white",
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                boxShadow: 3,
                alignItems: 'center'
            }}
        >
            <Grid item xs={6} md={3}>
                <Autocomplete
                    freeSolo
                    options={["Chennai", "Delhi", "Bengaluru"]}
                    value={searchOption.location || ""}
                    onInputChange={handleCityChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            label="City"
                            sx={{ backgroundColor: "white", width: "100%" }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOnIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={1}>
                    <IconButton
                        onClick={handleDecrease}
                        disabled={searchOption.numberOfGuest <= 1}
                        size={isXs ? "small" : "medium"}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <TextField
                        id="numberOfGuest"
                        value={searchOption.numberOfGuest}
                        label="Guest Each Room"
                        sx={{ width: '100%' }}
                        InputProps={{
                            readOnly: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="primary" />
                                </InputAdornment>
                            )
                        }}
                    />

                    <IconButton onClick={handleIncrease} size={isXs ? "medium" : "large"}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Grid>

            <Grid item xs={6} md={3}>
                <DatePicker
                    label="From"
                    value={searchOption.from}
                    onChange={(newValue) => setSearchOption({ ...searchOption, from: newValue })}
                    sx={{ backgroundColor: 'white', width: '100%' }}
                    minDate={dayjs()}
                />
            </Grid>

            <Grid item xs={6} md={3}>
                <DatePicker
                    label="To"
                    value={searchOption.to}
                    onChange={(newValue) => setSearchOption({ ...searchOption, to: newValue })}
                    sx={{ backgroundColor: 'white', width: '100%' }}
                    minDate={minDate}
                />
            </Grid>

            <Grid item xs={12} md={2}>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' },
                        width: '100%',
                        minHeight: { xs: '3em', md: '3.5em' }
                    }}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Grid>
        </Grid>
    );
}

export default SearchBar;