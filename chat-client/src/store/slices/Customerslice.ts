import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomerChat, CustomerRegister } from "../../types/customer.types";
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../services/customer.service";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchCustomers = createAsyncThunk(
  "customer/fetchAll",
  async () => {
    const data = await getCustomers();
    return data;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customer/fetchById",
  async (id: number) => {
    const data = await getCustomerById(id);
    return data;
  }
);

export const updateCustomerThunk = createAsyncThunk(
  "customer/update",
  async ({ id, data }: { id: number; data: CustomerRegister }) => {
    await updateCustomer(id, data);
    return { id, data };
  }
);

export const deleteCustomerThunk = createAsyncThunk(
  "customer/delete",
  async (id: number) => {
    await deleteCustomer(id);
    return id;
  }
);

// ── State ─────────────────────────────────────────────────────────────────────

type CustomerState = {
  customers: CustomerChat[];
  selectedCustomer: CustomerChat | null;
  loading: boolean;
  error: string | null;
};

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    setSelectedCustomer: (state, action: PayloadAction<CustomerChat>) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomerChat[]>) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת לקוחות";
        console.error("Failed to fetch customers:", action.error.message);
      });

    // fetchById
    builder
      .addCase(fetchCustomerById.fulfilled, (state, action: PayloadAction<CustomerChat>) => {
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בטעינת לקוח";
      });

    // update
    builder
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.customers.findIndex((c) => c.idCustomer === id);
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...data };
        }
      })
      .addCase(updateCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה בעדכון לקוח";
      });

    // delete
    builder
      .addCase(deleteCustomerThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.customers = state.customers.filter((c) => c.idCustomer !== action.payload);
      })
      .addCase(deleteCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || "שגיאה במחיקת לקוח";
      });
  },
});

export const { clearSelectedCustomer, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;