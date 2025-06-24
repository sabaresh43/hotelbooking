import React, { useState, useReducer, createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { findUserById } from '../../helpers/users';

const UserProfileContext = createContext();
const initialUserProfile = {};

const userProfileReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                ...action.payload.data
            };
        default: return state;
    }
};

export const UserProfileContextProvider = ({ children }) => {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    // store the data from backend
    const [userProfile, dispatch] = useReducer(userProfileReducer, initialUserProfile);

    useEffect(() => {
        loadUserProfile();
        //console.log(userProfile);
    }, []);


    const loadUserProfile = async () => {
        const userData = await findUserById(sessionKey);

        if (userData) {
            //console.log(userData);
            dispatch({
                type: 'initialize',
                payload: {
                    data: userData
                }
            })
        } else {
            //console.log("Failed to load user profile data");
        }
    }

    return (
        <UserProfileContext.Provider value={{ dispatch, userProfile, loadUserProfile }} >
            {children}
        </UserProfileContext.Provider>);
};

export default UserProfileContext;