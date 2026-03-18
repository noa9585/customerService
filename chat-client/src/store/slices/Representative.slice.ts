import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Representative, RepresentativeChat } from "../../types/representative.types";
import {
  getRepresentativeById,
  toggleBreak,
  returnFromBreak,
  logoutRepresentative,
  updateRepresentative,
} from "../../services/representative.service";
import type { RepresentativeUpdate } from "../../types/representative.types";

// ── Thunks ────────────────────────────────────────────────────────────────────

// שליפת הנציג המחובר (לדשבורד)
export const fetchRepresentativeById = createAsyncThunk(
  "representative/fetchRepresentative",
  async (id: number) => {
    const data = await getRepresentativeById(id);
    return data;
  }
);

// ✅ שליפת נציג אחר (ללקוח בצ'אט — לא מחליף את הנציג המחובר)
export const fetchRepresentativeByIdForChat = createAsyncThunk(
  "representative/fetchRepresentativeForChat",
  async (id: number) => {
    const data = await getRepresentativeById(id);
    return data;
  }
);

export const updateRepresentativeThunk = createAsyncThunk(
  "representative/update",
  async ({ id, data }: { id: number; data: RepresentativeUpdate }) => {
    await updateRepresentative(id, data);
    return { id, data };
  }
);

export const toggleBreakThunk = createAsyncThunk(
  "representative/toggleBreak",
  async (id: number) => {
    await toggleBreak(id);
    return id;
  }
);

export const returnFromBreakThunk = createAsyncThunk(
  "representative/returnFromBreak",
  async (id: number) => {
    await returnFromBreak(id);
    return id;
  }
);

export const logoutRepresentativeThunk = createAsyncThunk(
  "representative/logout",
  async (id: number) => {
    await logoutRepresentative(id);
    return id;
  }
);

// ── State ─────────────────────────────────────────────────────────────────────

type RepresentativeState = {
  representative: RepresentativeChat | null;       // הנציג המחובר
  selectedRepresentative: Representative | null; // ✅ נציג אחר (לצ'אט לקוח)
  loading: boolean;
  error: string | null;
};

const initialState: RepresentativeState = {
  representative: null,
  selectedRepresentative: null,
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const representativeSlice = createSlice({
  name: "representative",
  initialState,
  reducers: {
    clearRepresentative: (state) => {
      state.representative = null;
      state.error = null;
    },
    setRepresentative: (state, action: PayloadAction<Representative>) => {
      state.representative = action.payload;
    },
    clearSelectedRepresentative: (state) => {
      state.selectedRepresentative = null;
    },
  },
  extraReducers: (builder) => {
    // fetchRepresentativeById — נציג מחובר
    builder
      .addCase(fetchRepresentativeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepresentativeById.fulfilled, (state, action: PayloadAction<RepresentativeChat>) => {
        state.loading = false;
        state.representative = action.payload; // ← שומר בנציג המחובר
      })
      .addCase(fetchRepresentativeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת נציג";
        console.error("Failed to fetch representative:", action.error.message);
      });

    // fetchRepresentativeByIdForChat — נציג בצ'אט לקוח
    builder
      .addCase(fetchRepresentativeByIdForChat.fulfilled, (state, action: PayloadAction<RepresentativeChat>) => {
        state.representative = action.payload; // ← שומר בנפרד
      })
      .addCase(fetchRepresentativeByIdForChat.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בטעינת נציג";
      });

    // toggleBreak
    builder
      .addCase(toggleBreakThunk.fulfilled, (state) => {
        if (state.representative) state.representative.isOnline = false;
      })
      .addCase(toggleBreakThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה ביציאה להפסקה";
      });

    // returnFromBreak
    builder
      .addCase(returnFromBreakThunk.fulfilled, (state) => {
        if (state.representative) state.representative.isOnline = true;
      })
      .addCase(returnFromBreakThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בחזרה מהפסקה";
      });
  },
});

export const { clearRepresentative, setRepresentative, clearSelectedRepresentative } = representativeSlice.actions;
export default representativeSlice.reducer;