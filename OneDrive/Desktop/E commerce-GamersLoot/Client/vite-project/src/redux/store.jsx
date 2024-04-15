import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/user/userSlice'
import categoriesReducer from './reducers/admin/categoriesSlice'
import productReducer from './reducers/admin/ProductSlice'
export const store=configureStore({
    reducer:{
        user:userReducer,


        //user side reducers in store

        //Admin side reducers in store

        categories:categoriesReducer,
        products:productReducer




    }
})