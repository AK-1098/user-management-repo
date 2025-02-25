import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance";
import { AuthState, LoginPayload } from "./authTypes";

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/login", credentials);
      const token = response.data.token;
      localStorage.setItem("token", token);
      return { token };
    } catch (error) {
      return rejectWithValue(error || "Invalid email or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  }
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
