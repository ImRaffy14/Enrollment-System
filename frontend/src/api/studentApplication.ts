import axios, { AxiosError } from "axios"
import {  ErrorResponse } from "../types"


const urlAPI = import.meta.env.VITE_SERVER_URL

export const getStudentApplications = async () => {
    try {
        const result = await axios.get(`${urlAPI}/api/studentApplication`)
        return result.data.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}
export const createStudentApplication = async (data: any) => {
    try {
        const result = await axios.post(`${urlAPI}/api/studentApplication/createStudentApplication`, data)
        return result.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        
        if(axiosError.response){
            throw new Error(axiosError.response.data.error)
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}

export const editStudentApplication = async (data: any, id: string) => {
        try {
        const result = await axios.put(`${urlAPI}/api/studentApplication/editStudentApplication/${id}`, data)
        return result.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        
        if(axiosError.response){
            throw new Error(axiosError.response.data.error)
        }
        else if (axiosError.request) {
            throw new Error('Network error - no response from server');
        } 
        else {
            throw new Error('Request failed to be created');
        }
    }
}