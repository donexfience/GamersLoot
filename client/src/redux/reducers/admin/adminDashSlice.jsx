import { createSlice } from "@reduxjs/toolkit";
import { getBestSellingProducts } from "../../actions/admin/AdminDashAction";

const adminDashSlice = createSlice({
  name: "adminDash",
  initialState: {
    loading: false,
    BestsellingProduct: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBestSellingProducts.fulfilled, (state, { payload }) => {
        state.loading = true;
        state.BestsellingProduct = payload;
        state.error = null;
      })
      .addCase(getBestSellingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBestSellingProducts.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export default adminDashSlice.reducer