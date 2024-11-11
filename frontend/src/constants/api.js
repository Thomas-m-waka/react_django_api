// src/constants/api.js

export const BASE_URL = "http://127.0.0.1:8000";

export const LOGIN_URL = `${BASE_URL}/auth/jwt/create/`;
export const REGISTER_URL = `${BASE_URL}/auth/users/`;
export const USER_URL = `${BASE_URL}/auth/users/me/`;
export const LOGOUT_URL = `${BASE_URL}/auth/token/logout/`;
export const USER_PROFILE_URL =`${BASE_URL}/auth/users/me/profile/`;
export const SERVICE_LIST_URL = `${BASE_URL}/auth/users/me/services/`;
export const APPOINTMENTS_URL = `${BASE_URL}/auth/users/me/appointments/`;
export const PAYMENT_VERIFY_URL =`${BASE_URL}/payment/verify/`;
