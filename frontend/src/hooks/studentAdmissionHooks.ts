import { 
  createStudentAdmission,
  updateStudentAdmission,
  deleteStudentAdmission
} from "@/api/studentAdmissionAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateStudentAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createStudentAdmission(data),
    onSuccess: (response) => {
      const { admission } = response;

      queryClient.setQueryData(['admissions'], (oldAdmissions: any[]) =>
        oldAdmissions
          ? [...oldAdmissions, admission]
          : [admission]
      );

      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error('Create Admission Error:', {
        message: error.message,
        time: new Date().toISOString(),
        stack: error.stack,
      });
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
};

export const useUpdateStudentAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateStudentAdmission(data, id),
    onSuccess: (response) => {
      const { admission } = response;

      queryClient.setQueryData(['admissions'], (oldAdmissions: any[]) =>
        oldAdmissions
          ? oldAdmissions.map((oldAdmission) =>
              oldAdmission.id === admission.id ? { ...oldAdmission, ...admission } : oldAdmission
            )
          : [admission]
      );

      toast.success("Application Updated!");
    },
    onError: (error: Error) => {
      console.error('Update Admission Error:', {
        message: error.message,
        time: new Date().toISOString(),
        stack: error.stack,
      });
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
};

export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, id }: { status: string; id: string }) =>
      updateStudentAdmission({ status }, id),
    onSuccess: (response) => {
      const { admission } = response;

      queryClient.setQueryData(['admissions'], (oldAdmissions: any[]) =>
        oldAdmissions
          ? oldAdmissions.map((oldAdmission) =>
              oldAdmission.id === admission.id ? { ...oldAdmission, status: admission.status } : oldAdmission
            )
          : [admission]
      );

      toast.success('Application Updated!');
    },
    onError: (error: Error) => {
      console.error('Update Status Error:', {
        message: error.message,
        time: new Date().toISOString(),
        stack: error.stack,
      });
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
};

export const useDeleteStudentAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentAdmission(id),
    onSuccess: (response) => {
      const { admission } = response;

      queryClient.setQueryData(['admissions'], (oldAdmissions: any[]) =>
        oldAdmissions
          ? oldAdmissions.filter((oldAdmission) => oldAdmission.id !== admission.id)
          : []
      );

      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error('Delete Admission Error:', {
        message: error.message,
        time: new Date().toISOString(),
        stack: error.stack,
      });
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
};