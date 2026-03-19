import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatSession, ChatSessionCreate, ChatSessionUpdate } from "../../types/chatSession.types";
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getNextClient,
  closeSession,
  cancelSession,
} from "../../services/chatSession.service";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchSessions = createAsyncThunk(
  "chatSession/fetchAll",
  async () => {
    const data = await getAllSessions();
    return data;
  }
);

export const fetchSessionById = createAsyncThunk(
  "chatSession/fetchById",
  async (id: number) => {
    const data = await getSessionById(id);
    return data;
  }
);

// export const createSessionThunk = createAsyncThunk(
//   "chatSession/create",
//   async (dto: ChatSessionCreate) => {
//     const newSession = await createSession(dto);
//     return newSession;
//   }
// );

export const createSessionThunk = createAsyncThunk(
  'chatSession/create',
  async (sessionData: ChatSessionCreate, { rejectWithValue }) => {
    try {
      const response = await createSession(sessionData);
      return response;
    } catch (err: any) {
      // כאן הקסם קורה - אנחנו מחזירים את האובייקט שבו נמצא ה-message מהשרת
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateSessionThunk = createAsyncThunk(
  "chatSession/update",
  async ({ id, dto }: { id: number; dto: ChatSessionUpdate }) => {
    await updateSession(id, dto);
    return { id, dto };
  }
);

export const deleteSessionThunk = createAsyncThunk(
  "chatSession/delete",
  async (id: number) => {
    await deleteSession(id);
    return id;
  }
);

export const fetchNextClientThunk = createAsyncThunk(
  "chatSession/fetchNextClient",
  async (repId: number, { rejectWithValue }) => {
    try {
      const session = await getNextClient(repId);
      return session;
    } catch (err: any) {
      if (err.response?.status === 404) {
        // ✅ 404 = אין לקוחות — מצב תקין, לא שגיאה
        return rejectWithValue("אין לקוחות ממתינים בתור כרגע.");
      }
      return rejectWithValue("אירעה שגיאה בחיבור לשרת. אנא נסה שוב.");
    }
  }
);

export const closeSessionThunk = createAsyncThunk(
  "chatSession/close",
  async (id: number) => {
    const score = await closeSession(id);
    return { id, score };
  }
);

export const cancelSessionThunk = createAsyncThunk(
  "chatSession/cancel",
  async (id: number) => {
    await cancelSession(id);
    return id;
  }
);

// ── State ─────────────────────────────────────────────────────────────────────

type ChatSessionState = {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  lastScore: number | null;
};

const initialState: ChatSessionState = {
  sessions: [],
  activeSession: null,
  loading: false,
  error: null,
  lastScore: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const chatSessionSlice = createSlice({
  name: "chatSession",
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<ChatSession>) => {
      state.activeSession = action.payload;
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLastScore: (state) => {
    state.lastScore = null;
  },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action: PayloadAction<ChatSession[]>) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת שיחות";
        console.error("Failed to fetch sessions:", action.error.message);
      });

    // fetchById
    builder
      .addCase(fetchSessionById.fulfilled, (state, action: PayloadAction<ChatSession>) => {
        state.activeSession = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בטעינת שיחה";
      });

    // create
    builder
      .addCase(createSessionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSessionThunk.fulfilled, (state, action: PayloadAction<ChatSession>) => {
        state.loading = false;
        state.sessions.push(action.payload);
        state.activeSession = action.payload;
      })
      .addCase(createSessionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה ביצירת שיחה";
      });

    // fetchNextClient — ✅ משתמש ב-rejectWithValue להודעה נקייה
    builder
      .addCase(fetchNextClientThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextClientThunk.fulfilled, (state, action: PayloadAction<ChatSession>) => {
        state.loading = false;
        state.activeSession = action.payload;
      })
      .addCase(fetchNextClientThunk.rejected, (state, action) => {
        state.loading = false;
        // action.payload מגיע מ-rejectWithValue — הודעה ידידותית
        state.error = (action.payload as string) || "שגיאה במשיכת לקוח";
      });

    // close
    builder
      .addCase(closeSessionThunk.fulfilled, (state, action: PayloadAction<{ id: number; score: number }>) => {
        // 1. חילוץ הנתונים מה-payload (האובייקט שה-Thunk החזיר)
        const { id, score } = action.payload;

        // 2. שמירת הציון ב-State (כדי שהחלונית תוכל להציג אותו)
        state.lastScore = score;

        // 3. הסרת השיחה מהרשימה הכללית
        state.sessions = state.sessions.filter((s) => s.sessionID !== id);

        // 4. אם זו השיחה הפעילה כרגע - ננקה אותה
        if (state.activeSession?.sessionID === id) {
          state.activeSession = null;
        }
      })
    // cancel
    builder
      .addCase(cancelSessionThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.sessions = state.sessions.filter((s) => s.sessionID !== action.payload);
        if (state.activeSession?.sessionID === action.payload) {
          state.activeSession = null;
        }
      })
      .addCase(cancelSessionThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בביטול שיחה";
      });
  },
});

export const { setActiveSession, clearActiveSession, clearError,clearLastScore } = chatSessionSlice.actions;
export default chatSessionSlice.reducer;