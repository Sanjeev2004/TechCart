import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product: string; // product ID
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
}

const getInitialCartItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
  }
  return [];
};

const getInitialShippingAddress = () => {
  if (typeof window !== 'undefined') {
    const address = localStorage.getItem('shippingAddress');
    return address ? JSON.parse(address) : {};
  }
  return {};
};

const getInitialPaymentMethod = () => {
  if (typeof window !== 'undefined') {
    const method = localStorage.getItem('paymentMethod');
    return method ? JSON.parse(method) : 'Stripe';
  }
  return 'Stripe';
};

const initialState: CartState = {
  cartItems: getInitialCartItems(),
  shippingAddress: getInitialShippingAddress(),
  paymentMethod: getInitialPaymentMethod(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems');
      }
    },
    saveShippingAddress: (state, action: PayloadAction<any>) => {
      state.shippingAddress = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      }
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCartItems, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
