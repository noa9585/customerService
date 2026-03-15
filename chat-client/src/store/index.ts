import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // בעתיד נוסיף כאן סלייסים נוספים כמו chat או topics
  },
});

// טיפוסים לעזרה ב-TypeScript (חשוב מאוד לעבודה עם Hooks בהמשך)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;