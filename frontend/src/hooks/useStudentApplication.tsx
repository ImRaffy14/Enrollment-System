import {
    editStudentApplication
} from '../api/studentApplication'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useEditStudentApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      editStudentApplication(data, id),
    onSuccess: (response) => {
      const { data } = response;

      queryClient.setQueryData(['applications'], (oldUsers: any[]) =>
        oldUsers
          ? oldUsers.map((oldUser) =>
              oldUser.id === data.id ? { ...oldUser, ...data } : oldUser
            )
          : [data]
      );

      toast.success('Updated Succesfully');
    },
    onError: (error: Error) => {
      console.error('Edit User Error:', {
        message: error.message,
        time: new Date().toISOString(),
        stack: error.stack,
      });
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};