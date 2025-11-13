import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/fakeApi";

export const fetchPlans = createAsyncThunk("plans/fetch", async (_, thunkAPI) => {
    const res = await api.getPlans();
    if (!res.ok) return thunkAPI.rejectWithValue(res.error);
    return res.plans;
});

export const subscribePlan = createAsyncThunk("plans/subscribe", async ({ userId, planId }, thunkAPI) => {
    const res = await api.subscribe({ userId, planId });
    if (!res.ok) return thunkAPI.rejectWithValue(res.error);
    return res.subscription;
});

export const fetchMySubscription = createAsyncThunk("plans/mySubscription", async ({ userId }, thunkAPI) => {
    const res = await api.mySubscription({ userId });
    if (!res.ok) return thunkAPI.rejectWithValue(res.error);
    return res.subscription;
});

const slice = createSlice({
    name: "plans",
    initialState: { list: [], mySubscription: null, status: "idle", error: null },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPlans.fulfilled, (state, action) => { state.list = action.payload; state.status = "succeeded"; })
            .addCase(subscribePlan.fulfilled, (state, action) => { state.mySubscription = action.payload; })
            .addCase(fetchMySubscription.fulfilled, (state, action) => { state.mySubscription = action.payload; });
    }
});

export default slice.reducer;
