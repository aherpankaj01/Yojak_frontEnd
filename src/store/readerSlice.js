import { createSlice } from "@reduxjs/toolkit";
import {
    DEFAULT_PREFS,
    STORAGE_KEY,
    sanitizePrefs,
} from "../Component/reader/readerConfig";

const loadPrefs = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? sanitizePrefs(JSON.parse(raw)) : { ...DEFAULT_PREFS };
    } catch {
        return { ...DEFAULT_PREFS };
    }
};

const readerSlice = createSlice({
    name: "reader",
    initialState: loadPrefs(),
    reducers: {
        setPref: (state, action) => {
            const { key, value } = action.payload;
            return sanitizePrefs({ ...state, [key]: value });
        },
        resetPrefs: () => ({ ...DEFAULT_PREFS }),
    },
});

export const { setPref, resetPrefs } = readerSlice.actions;
export default readerSlice.reducer;