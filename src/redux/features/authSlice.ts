import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { LoginCredentials, UserProfile, AuthResponse } from "@/types/auth";
import { ApiErrorResponse } from "@/services/api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Admin Login Async Thunk
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ApiErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err as ApiErrorResponse);
  }
});

// Admin Get Profile Async Thunk
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: ApiErrorResponse }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getProfile();
    return data;
  } catch (err) {
    return rejectWithValue(err as ApiErrorResponse);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:auth");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User Handlers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed. Please check credentials.";
      })

      // Fetch Profile Handlers
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user profile.";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

export default authSlice.reducer;
