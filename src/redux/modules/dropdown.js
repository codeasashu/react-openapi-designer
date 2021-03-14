import { createSlice } from '@reduxjs/toolkit'
import { set, isUndefined, get } from 'lodash';

export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
    properties: {show: true}
  },
  reducers: {
      setOpenDropdownPath: (state, action) => {
        const { key, value } = action.payload;
        const path = [].concat(key, 'show');
        const isOpen = get(state, path) === true;
        const status = isUndefined(value) ? !isOpen : !!value;
        return set(state, path, status);
      },
  }
});

export default dropdownSlice.reducer