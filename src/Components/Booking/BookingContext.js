import { createContext, useContext, useEffect, useReducer, useState } from "react";

const initialBookingData = {
};

const BookingContext = createContext();

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                hotel: action.payload.data.hotel,
                from: action.payload.data.from,
                to: action.payload.data.to,
                duration: action.payload.data.duration,
                numberOfGuest: action.payload.data.numberOfGuest,
                isBookingSuccess: false
            };
        case 'setBookingDetails':
            return {
                ...state,
                rooms: action.payload.data.rooms,
                totalPrice: action.payload.data.totalPrice
            }
        case 'setClientInfo':
            return {
                ...state,
                clientInfo: action.payload.data
            }
        case 'setCardInfo':
            return {
                ...state,
                cardInfo: action.payload.data
            }
        case 'setIsBookingSuccess':
            return {
                ...state,
                isBookingSuccess: true
            }
        case 'setIsBookingFailed':
            return {
                ...state,
                isBookingSuccess: false
            }
        default: return state;
    }
};

export const BookingContextProvider = ({ children }) => {
    const [bookingData, dispatch] = useReducer(bookingReducer, initialBookingData);

    return (<BookingContext.Provider value={{ bookingData, dispatch }}>
        {children}
    </BookingContext.Provider>);
}

export default BookingContext;