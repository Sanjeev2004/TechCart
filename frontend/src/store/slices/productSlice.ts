import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: any;
  brand: string;
  ratings: number;
  numOfReviews: number;
}

interface ProductState {
  products: Product[];
  productDetails: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (keyword: string = '', { rejectWithValue }) => {
    try {
      const response = await api.get(`/products?keyword=${keyword}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
