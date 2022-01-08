import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../user/userSlice';
import authReducer from '../auth/authSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    authState: authReducer,
  },
});
