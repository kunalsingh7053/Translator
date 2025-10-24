import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    users: null,
    initialized: false, // becomes true after fetchUserProfile completes
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loaduser: (state, action) => {
            // always normalize to either an object or null
            state.users = action.payload || null
        },
        removeuser: (state) => {
            state.users = null
        },
        setInitialized: (state, action) => {
            state.initialized = !!action.payload
        },
    },
})

export default userSlice.reducer;
export const { loaduser, removeuser, setInitialized } = userSlice.actions;
 