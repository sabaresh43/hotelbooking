import React, { useState, useEffect, createContext } from 'react';
import dayjs from 'dayjs';
import { hotelService } from '../../services/hotel.service';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchContext = createContext();

const CITY_CODE_MAP = {
    chennai: '1175',
    delhi: '514',
    bengaluru: '234',
};

const getCityByCode = (code) => {
    const entry = Object.entries(CITY_CODE_MAP).find(([_, value]) => value === code);
    return entry ? entry[0].charAt(0).toUpperCase() + entry[0].slice(1) : '';
};

const STORAGE_KEY = 'hotelSearchParams';

export const SearchContextProvider = ({ children }) => {
    const location = useLocation();

    // Initialize search options from URL params, localStorage, or defaults
    const [searchOption, setSearchOption] = useState(() => {
        const params = new URLSearchParams(location.search);
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedOptions = stored ? JSON.parse(stored) : null;
        
        const cityCode = params.get('cityCode') || storedOptions?.cityCode;
        const cityName = getCityByCode(cityCode) || 'Chennai';
        
        const defaultOptions = {
            location: cityName,
            cityCode: cityCode || CITY_CODE_MAP[cityName.toLowerCase()],
            from: dayjs(params.get('from') || storedOptions?.from || undefined),
            to: dayjs(params.get('to') || storedOptions?.to || undefined).add(1, 'day'),
            numberOfGuest: parseInt(params.get('guests') || storedOptions?.numberOfGuest || 1),
            price: storedOptions?.price || [0, 500],
            tags: storedOptions?.tags || {
                parking: false,
                wifi: false,
                laundry: false,
                bar: false,
                restaurant: false,
                pool: false,
                breakfast: false
            },
            rating: parseInt(params.get('rating') || storedOptions?.rating || 0)
        };

        return defaultOptions;
    });

    // Persist to localStorage whenever searchOption changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchOption));
    }, [searchOption]);

    return (
        <SearchContext.Provider value={{
            searchOption,
            setSearchOption
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchContext;