import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../types";

const urlAPI = import.meta.env.VITE_SERVER_URL;

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${urlAPI}/api/dashboard/stats`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to fetch dashboard stats');
  }
};

export const getRecentApplications = async () => {
  try {
    const response = await axios.get(`${urlAPI}/api/dashboard/recent-applications`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to fetch recent applications');
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await axios.get(`${urlAPI}/api/dashboard/upcoming-events`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to fetch upcoming events');
  }
};