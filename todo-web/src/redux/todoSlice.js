import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchText: ''
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        search: (state, action) => {
            state.searchText = action.payload
        },
        clearSearch: (state, action) => {
            state.searchText = ''
        }
    }
})

export const {search, clearSearch} = todoSlice.actions

export default todoSlice.reducer
