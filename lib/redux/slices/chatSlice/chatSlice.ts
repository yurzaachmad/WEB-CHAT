/* Core */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* Instruments */
import { loadChatAsync } from "./thunks";

const initialState: ChatSliceState = {
  value: [],
  status: "idle",
  sender: "",
  receiver: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state, action: PayloadAction<Message>) => {
      state.value.push(action.payload);
    },
    sender: (state, action: PayloadAction<string>) => {
      state.sender = action.payload;
    },
    receiver: (state, action: PayloadAction<string>) => {
      state.receiver = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(loadChatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadChatAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = action.payload;
      })
      .addCase(loadChatAsync.rejected, (state, action) => {
        state.status = "failed";
        state.value = [];
      });
  },
});

export interface ChatSliceState {
  value: Message[];
  status: "idle" | "loading" | "failed";
  sender: string;
  receiver: string;
}
