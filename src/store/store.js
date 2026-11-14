import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import readerReducer from "./readerSlice";
import { STORAGE_KEY } from "../Component/reader/readerConfig";

const store = configureStore({
  reducer: {
    auth: authReducer,
    reader: readerReducer,
  },
});

let lastReaderState = store.getState().reader;
store.subscribe(() => {
  const current = store.getState().reader;
  if (current === lastReaderState) return;
  lastReaderState = current;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
  }
});

export default store;