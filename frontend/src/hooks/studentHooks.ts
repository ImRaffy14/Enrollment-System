import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getStudents as getStudentsAPI,
  getStudentById as getStudentByIdAPI,
  updateStudent as updateStudentAPI,
  updateStudentStatus as updateStudentStatusAPI
} from "@/api/studentAPI";
import toast from "react-hot-toast";

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStudentsAPI,
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentByIdAPI(id),
    enabled: !!id,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) => 
      updateStudentAPI(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update student');
    }
  });
};

export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, id }: { status: string; id: string }) => 
      updateStudentStatusAPI(status, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    }
  });
};