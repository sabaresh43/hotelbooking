import React, { createContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import hotelService from '../../services/hotel.service';

export const UserViewBookingContext = createContext();

const initialBookingList = {
    bookings: [],
    hotels: [],
    isLoaded: false,
    error: null
};

const bookingListReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                ...state,
                bookings: action.payload.data.bookings,
                hotels: action.payload.data.hotels,
            };
        case 'setIsLoaded':
            return {
                ...state,
                isLoaded: true
            };
        case 'setError':
            return {
                ...state,
                error: action.payload.error,
                isLoaded: true
            };
        default: 
            return state;
    }
};

export const UserViewBookingContextProvider = ({ children }) => {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [bookingList, dispatch] = useReducer(bookingListReducer, initialBookingList);

    useEffect(() => {
        if (isAuthenticated) {
            loadBookingList();
        }
    }, [isAuthenticated]);

    const loadBookingList = async () => {
        try {
            console.log("🔄 Loading bookings from Frappe API...");
            
            // ✅ Try Frappe API first
            const response = await hotelService.getUserBookings();
            
            if (response.success && response.bookings && response.bookings.length > 0) {
                console.log("✅ Loaded bookings from Frappe:", response.bookings.length);
                
                dispatch({
                    type: 'initialize',
                    payload: {
                        data: {
                            bookings: response.bookings,
                            hotels: [] // Not needed for Frappe bookings
                        }
                    }
                });
            } 
           
        } catch (error) {
            console.error('❌ Error loading bookings:', error);
            dispatch({
                type: 'setError',
                payload: { error: error.message }
            });
        }

        dispatch({
            type: 'setIsLoaded'
        });
    };

    const reloadBookings = () => {
        dispatch({ type: 'initialize', payload: { data: { bookings: [], hotels: [] } } });
        dispatch({ type: 'setIsLoaded' });
        loadBookingList();
    };

    return (
        <UserViewBookingContext.Provider value={{ 
            dispatch, 
            bookingList,
            reloadBookings
        }}>
            {children}
        </UserViewBookingContext.Provider>
    );
};

export default UserViewBookingContext;