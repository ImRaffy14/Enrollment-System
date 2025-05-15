import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentApplications,
  getUpcomingEvents
} from "@/api/dashboardAPI";


export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
};

export const useRecentApplications = () => {
  return useQuery({
    queryKey: ['recent-applications'],
    queryFn: getRecentApplications,
  });
};

export const useUpcomingEvents = () => {
  return useQuery({
    queryKey: ['upcoming-events'],
    queryFn: getUpcomingEvents,
  });
};