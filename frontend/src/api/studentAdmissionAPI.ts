import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../types";

const urlAPI = import.meta.env.VITE_SERVER_URL;

export const getStudentAdmissions = async () => {
    try {
        const result = await axios.get(`${urlAPI}/api/admissions`);
        return result.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}

export const getStudentAdmissionById = async (id: string) => {
    try {
        const result = await axios.get(`${urlAPI}/api/admissions/${id}`);
        return result.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data.error);
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}

export const createStudentAdmission = async (data: any) => {
    try {
        const result = await axios.post(`${urlAPI}/api/admissions`, data);
        return result.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
            throw new Error(axiosError.response.data.error);
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}

export const updateStudentAdmission = async (data: any, id: string) => {
    try {
        const result = await axios.put(`${urlAPI}/api/admissions/${id}`, data);
        return result.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
            throw new Error(axiosError.response.data.error);
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}

export const deleteStudentAdmission = async (id: string) => {
    try {
        const result = await axios.delete(`${urlAPI}/api/admissions/${id}`);
        return result.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
            throw new Error(axiosError.response.data.error);
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}