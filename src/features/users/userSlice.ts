import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance";
import { UserState, User } from "./userTypes";

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

// Fetch Users Thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users?page=${page}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete user");
    }
  }
);
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create user");
    }
  }
);

// Update User Thunk
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  }
});

export default userSlice.reducer;
