import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  config,
  handleError,
  configMultiPart,
} from "../../Common/configurations";
import { URL, commonReduxRequests } from "../../Common/api";

export const logout = createAsyncThunk(
  "user/logout",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${URL}/user/logout`, config);

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getUserDataFirst = createAsyncThunk(
  "user/getUserDataFirst",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${URL}/user/`, config);
      return data
  }
  catch(err){
    return handleError(err,rejectWithValue)
  }
}
);
//one method without using the commonreduxrequests

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/login`,
        userCredentials,
        config
      );

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const googleLoginOrSignUp = createAsyncThunk(
  "user/googleLoginOrSignUp",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/google`,
        { token: userCredentials.credential },
        config
      );
      return data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/signup`,
        userCredentials,
        configMultiPart
      );

      return data;
    } catch (error) {
      console.log("error from signup",error)
      return handleError(error, rejectWithValue);
    }
  }
);
//editt profile
