import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types";

const urlAPI = import.meta.env.VITE_SERVER_URL;

export const getStudents = async () => {
  try {
    const response = await axios.get(`${urlAPI}/api/students`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to fetch students');
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axios.get(`${urlAPI}/api/students/${id}`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to fetch student');
  }
};

export const updateStudent = async (data: any, id: string) => {
  try {
    const response = await axios.put(`${urlAPI}/api/students/${id}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to update student');
  }
};

export const updateStudentStatus = async (status: string, id: string) => {
  try {
    const response = await axios.patch(`${urlAPI}/api/students/${id}/status`, { status });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'Failed to update status');
  }
};