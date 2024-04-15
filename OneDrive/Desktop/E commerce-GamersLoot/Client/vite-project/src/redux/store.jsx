import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/user/userSlice'
import categoriesReducer from './reducers/admin/categoriesSlice'
import productReducer from './reducers/admin/ProductSlice'
import customerReducer from './reducers/admin/customerSlice'
import userProductReducer from "./reducers/user/userProductSlice";
export const store=configureStore({
    reducer:{
        user:userReducer,


        //user side reducers in store
        userProducts:userProductReducer,

        //Admin side reducers in store

        categories:categoriesReducer,
        products:productReducer,
        customer:customerReducer




    }
})