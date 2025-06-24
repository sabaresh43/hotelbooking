import { useRef, useCallback } from 'react';

// use this hook to create a debounced version of a function
// the function will only be called after the specified delay
// all the intermediate calls during the delay will be ignored
export function useDebounce(cb, delay = 1000) {
    // store the timeout id so we can clear it later
    // useRef is better than useState because we don't want to re-render the component
    // and it will survive the re-renders
    const timeoutId = useRef(null);

    // Wrap the returned function in useCallback
    // It ensures the function reference is stable unless cb or delay changes
    // otherwise, it will create a new function on every render
    return useCallback(function (...args) {
        // clear the timeout if it exists
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        // set a new timeout to delay the function call
        timeoutId.current = setTimeout(() => {
            cb(...args);
        }, delay);
    }, [cb, delay]); // Add cb and delay as dependencies
}

