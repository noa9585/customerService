import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage, ChatMessageSend } from "../../types/chatMessage.types";
import {
  getAllMessages,
  getHistory,
  sendMessage,
  deleteMessage,
} from "../../services/chatMessage.service";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchMessages = createAsyncThunk(
  "chatMessage/fetchAll",
  async () => {
    const data = await getAllMessages();
    return data;
  }
);

export const fetchChatHistory = createAsyncThunk(
  "chatMessage/fetchHistory",
  async (sessionId: number) => {
    const data = await getHistory(sessionId);
    return data;
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chatMessage/send",
  async (dto: ChatMessageSend) => {
    const message = await sendMessage(dto);
    return message;
  }
);

export const deleteMessageThunk = createAsyncThunk(
  "chatMessage/delete",
  async (id: number) => {
    await deleteMessage(id);
    return id;
  }
);

// ── State ─────────────────────────────────────────────────────────────────────

type ChatMessageState = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
};

const initialState: ChatMessageState = {
  messages: [],
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const chatMessageSlice = createSlice({
  name: "chatMessage",
  initialState,
  reducers: {
    // הוספת הודעה שהגיעה מ-SignalR בזמן אמת
    addMessageRealtime: (state, action: PayloadAction<ChatMessage>) => {
      const exists = state.messages.find((m) => m.messageID === action.payload.messageID);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchHistory
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת היסטוריית הודעות";
        console.error("Failed to fetch chat history:", action.error.message);
      });

    // send
    builder
      .addCase(sendMessageThunk.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        const exists = state.messages.find((m) => m.messageID === action.payload.messageID);
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בשליחת הודעה";
      });

    // delete
    builder
      .addCase(deleteMessageThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.messages = state.messages.filter((m) => m.messageID !== action.payload);
      })
      .addCase(deleteMessageThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה במחיקת הודעה";
      });
  },
});

export const { addMessageRealtime, clearMessages, clearError } = chatMessageSlice.actions;
export default chatMessageSlice.reducer;