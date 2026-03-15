import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerChat } from '../../types/customer.types';
import { Representative } from '../../types/representative.types';

interface AuthState {
  user: CustomerChat | Representative | null;
  userType: 'customer' | 'representative' | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  userType: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // פעולה לעדכון המשתמש המחובר (לוגין)
    setCredentials: (
      state, 
      action: PayloadAction<{ user: CustomerChat | Representative; userType: 'customer' | 'representative' }>
    ) => {
      const { user, userType } = action.payload;
      state.user = user;
      state.userType = userType;
      state.isAuthenticated = true;
    },
    // פעולה להתנתקות
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;