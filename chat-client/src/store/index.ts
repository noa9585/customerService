import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import representativeReducer from './slices/Representative.slice';
import customerReducer from './slices/Customerslice';
import topicReducer from './slices/Topic.slice';
import chatSessionReducer from './slices/Chatsession.slice';
import chatMessageReducer from './slices/Chatmessage.slice';

export const store = configureStore({
  reducer: {
    auth:            authReducer,
    representative:  representativeReducer,
    customer:        customerReducer,
    topic:           topicReducer,
    chatSession:     chatSessionReducer,
    chatMessage:     chatMessageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;