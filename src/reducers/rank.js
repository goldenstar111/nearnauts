import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'rank',
  initialState:{
  	data:[]
  },
  reducers: {
    addRank(state, action) {
      state.data = [...state.data,...action.payload];
    },
  },
});

export { actions as rankActions };
export { reducer as rankReducer };