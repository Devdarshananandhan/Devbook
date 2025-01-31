import api from '../utils/api';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');
    
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);

    if (res.data.status === 'success') {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      // Set the token in axios headers
      if (res.data.token) {
        setAuthToken(res.data.token);
      }

      dispatch(loadUser());
      dispatch(setAlert('Registration successful', 'success'));
    } else {
      dispatch({ type: REGISTER_FAIL });
      dispatch(setAlert(res.data.message || 'Registration failed', 'danger'));
    }
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    } else {
      dispatch(setAlert(err.response?.data?.message || 'Registration failed', 'danger'));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await api.post('/auth', { email, password });

    if (res.data.status === 'success') {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      // Set the token in axios headers
      if (res.data.token) {
        setAuthToken(res.data.token);
      }

      dispatch(loadUser());
      dispatch(setAlert('Login successful', 'success'));
    } else {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(res.data.message || 'Login failed', 'danger'));
    }
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    } else {
      dispatch(setAlert(err.response?.data?.message || 'Invalid credentials', 'danger'));
    }

    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
