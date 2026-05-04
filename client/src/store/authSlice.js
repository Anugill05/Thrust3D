import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

const getStored = (key, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return fallback }
}

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const endpoint = creds.isAdmin ? '/auth/admin/login' : '/auth/login'
    const { data } = await api.post(endpoint, creds)
    localStorage.setItem('p3d_token', data.token)
    localStorage.setItem('p3d_user', JSON.stringify(data.user))
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed') }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('p3d_token', data.token)
    localStorage.setItem('p3d_user', JSON.stringify(data.user))
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed') }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStored('p3d_user'),
    token: localStorage.getItem('p3d_token') || null,
    loading: false, error: null,
    isAuthenticated: !!localStorage.getItem('p3d_token')
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.isAuthenticated = false; state.error = null
      localStorage.removeItem('p3d_token'); localStorage.removeItem('p3d_user')
    },
    clearError(state) { state.error = null }
  },
  extraReducers: (builder) => {
    const pending  = (s) => { s.loading = true; s.error = null }
    const rejected = (s, a) => { s.loading = false; s.error = a.payload }
    const fulfilled = (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isAuthenticated = true }
    builder
      .addCase(loginUser.pending, pending).addCase(loginUser.fulfilled, fulfilled).addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending).addCase(registerUser.fulfilled, fulfilled).addCase(registerUser.rejected, rejected)
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
