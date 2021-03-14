import { createSlice } from '@reduxjs/toolkit'
import { set, isUndefined, get } from 'lodash';

export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
    properties: true
  },
  reducers: {
      setOpenDropdownPath: (state, action) => {
        const { key, value } = action.payload;
        const status = isUndefined(value) ? !get(state, key) : !!value;
        return set(state, key, status);
      },
  }
});

export default dropdownSlice.reducer