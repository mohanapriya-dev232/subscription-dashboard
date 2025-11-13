import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/fakeApi";

// tokens stored in localStorage
const TOK_KEY = "subdash_tokens";

const persisted = JSON.parse(localStorage.getItem(TOK_KEY) || "null");

export const register = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  const res = await api.register(payload);
  if (!res.ok) return thunkAPI.rejectWithValue(res.error);
  return res.user;
});

export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  const res = await api.login(payload);
  if (!res.ok) return thunkAPI.rejectWithValue(res.error);
  const { user, tokens } = res;
  localStorage.setItem(TOK_KEY, JSON.stringify(tokens));
  return { user, tokens };
});

export const refreshAccess = createAsyncThunk("auth/refresh", async ({ refreshToken }, thunkAPI) => {
  const res = await api.refreshAccessToken({ refreshToken });
  if (!res.ok) return thunkAPI.rejectWithValue(res.error);
  const prev = JSON.parse(localStorage.getItem(TOK_KEY) || "{}");
  const newTokens = { ...prev, accessToken: res.accessToken, expiresAt: res.expiresAt };
  localStorage.setItem(TOK_KEY, JSON.stringify(newTokens));
  return newTokens;
});

const slice = createSlice({
  name: "auth",
  initialState: {
    user: persisted?.user || null,
    tokens: persisted || null,
    status: "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.tokens = null;
      localStorage.removeItem(TOK_KEY);
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "registered";
      });
  }
});

export const { logout, setUser } = slice.actions;
export default slice.reducer;
