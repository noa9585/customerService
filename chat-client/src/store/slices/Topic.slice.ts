import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Topic, TopicAdd } from "../../types/topic.types";
import {
  getAllTopics,
  getTopicById,
  addTopic,
  updateTopic,
  deleteTopic,
} from "../../services/topic.service";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchTopics = createAsyncThunk(
  "topic/fetchAll",
  async () => {
    const data = await getAllTopics();
    return data;
  }
);

export const fetchTopicById = createAsyncThunk(
  "topic/fetchById",
  async (id: number) => {
    const data = await getTopicById(id);
    return data;
  }
);

export const addTopicThunk = createAsyncThunk(
  "topic/add",
  async (data: TopicAdd) => {
    const newTopic = await addTopic(data);
    return newTopic;
  }
);

export const updateTopicThunk = createAsyncThunk(
  "topic/update",
  async ({ id, data }: { id: number; data: TopicAdd }) => {
    await updateTopic(id, data);
    return { id, data };
  }
);

export const deleteTopicThunk = createAsyncThunk(
  "topic/delete",
  async (id: number) => {
    await deleteTopic(id);
    return id;
  }
);

// ── State ─────────────────────────────────────────────────────────────────────

type TopicState = {
  topics: Topic[];
  selectedTopic: Topic | null;
  loading: boolean;
  error: string | null;
};

const initialState: TopicState = {
  topics: [],
  selectedTopic: null,
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setSelectedTopic: (state, action: PayloadAction<Topic>) => {
      state.selectedTopic = action.payload;
    },
    clearSelectedTopic: (state) => {
      state.selectedTopic = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת נושאים";
        console.error("Failed to fetch topics:", action.error.message);
      });

    // add
    builder
      .addCase(addTopicThunk.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.topics.push(action.payload);
      })
      .addCase(addTopicThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בהוספת נושא";
      });

    // update
    builder
      .addCase(updateTopicThunk.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.topics.findIndex((t) => t.idTopic === id);
        if (index !== -1) {
          state.topics[index] = { ...state.topics[index], ...data };
        }
      })
      .addCase(updateTopicThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בעדכון נושא";
      });

    // delete
    builder
      .addCase(deleteTopicThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.topics = state.topics.filter((t) => t.idTopic !== action.payload);
      })
      .addCase(deleteTopicThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה במחיקת נושא";
      });
  },
});

export const { setSelectedTopic, clearSelectedTopic } = topicSlice.actions;
export default topicSlice.reducer;