import React, { useState, useReducer, createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { findBookingByUserId } from '../../helpers/bookings';
import { getUserBookedHotels } from '../../helpers/hotels';

const UserViewBookingContext = createContext();
const initialBookingList = {
    isLoaded: false,
    bookings: [],
    hotels: []
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
        default: return state;
    }
};

export const UserViewBookingContextProvider = ({ children }) => {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    // store the data from backend
    const [bookingList, dispatch] = useReducer(bookingListReducer, initialBookingList);

    useEffect(() => {
        loadBookingList();
    }, []);


    const loadBookingList = async () => {
        var hotelData;
        var bookingData;
        bookingData = await findBookingByUserId(sessionKey);

        // find the corresponding hotel data appears in the booking
        if (bookingData.length !== 0) {

            try {
                const userBookedHotels = await getUserBookedHotels(sessionKey);
                hotelData = userBookedHotels;
            } catch (error) {
                console.error('Error during findAll hotels:', error);
            }

            if (hotelData.length !== 0) {
                dispatch({
                    type: 'initialize',
                    payload: {
                        data: {
                            bookings: bookingData,
                            hotels: hotelData
                        }
                    }
                })
            }
        } else {
            console.error('No booking found on server');
        }

        dispatch({
            type: 'setIsLoaded'
        });
    }

    return (
        <UserViewBookingContext.Provider value={{ dispatch, bookingList }} >
            {children}
        </UserViewBookingContext.Provider>);
};

export default UserViewBookingContext;