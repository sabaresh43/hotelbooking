import React, { useState, useEffect, createContext } from 'react';
import dayjs from 'dayjs';

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {

    const [searchOption, setSearchOption] = useState({
        location: 'Toronto',
        from: dayjs(),
        to: dayjs().add(1, 'day'),
        numberOfGuest: 1,
        price: [0, 500],
        tags: {
            parking: false,
            wifi: false,
            laundry: false,
            bar: false,
            restaurant: false,
            pool: false,
            breakfast: false
        },
        rating: 0
    });

    return (<SearchContext.Provider value={{ searchOption, setSearchOption }}>
        {children}
    </SearchContext.Provider>);
}

export default SearchContext;