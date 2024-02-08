import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        jwt: null
    },
    reducers: {
        set:(state, action)=>{
            state.jwt = action.payload;
        },
        clear:(state, action)=>{
            state.jwt = null;
        }
    }
})

export default authSlice;
