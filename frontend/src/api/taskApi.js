import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const unwrapError = (error) => {
  const message =
    error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
  throw new Error(message);
};

export const fetchTasks = async (params = {}) => {
  try {
    const { data } = await client.get('/tasks', { params });
    return data.data;
  } catch (error) {
    return unwrapError(error);
  }
};

export const createTask = async (payload) => {
  try {
    const { data } = await client.post('/tasks', payload);
    return data.data;
  } catch (error) {
    return unwrapError(error);
  }
};

export const updateTask = async (id, payload) => {
  try {
    const { data } = await client.put(`/tasks/${id}`, payload);
    return data.data;
  } catch (error) {
    return unwrapError(error);
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await client.delete(`/tasks/${id}`);
    return data.data;
  } catch (error) {
    return unwrapError(error);
  }
};
