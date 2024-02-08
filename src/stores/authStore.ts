import {configureStore} from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";

const authStore = configureStore({
    reducer: {
        auth: authSlice.reducer
    },

})

export default authStore;
