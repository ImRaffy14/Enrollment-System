"use client"

import {
  Bell,
  FileText,
  UserCheck,
  BookOpen,
  ShoppingCart,
  Calendar,
  GraduationCap,
  Loader2
} from "lucide-react"
import { useDashboardStats, useRecentApplications, useUpcomingEvents } from "@/hooks/dashboardHooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface EnrollmentStat {
  label: string
  value: string
  change: string
  icon: React.ReactNode
}

const Dashboard = () => {
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats()
  const { data: recentApplications, isLoading: isAppsLoading } = useRecentApplications()
  const { data: upcomingEvents, isLoading: isEventsLoading } = useUpcomingEvents()

  // Enrollment statistics
  const enrollmentStats: EnrollmentStat[] = [
    {
      label: "Total Applications",
      value: stats?.totalApplications.value.toString() || "0",
      change: stats?.totalApplications.change || "+0%",
      icon: <FileText className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Approved Admissions",
      value: stats?.approvedAdmissions.value.toString() || "0",
      change: stats?.approvedAdmissions.change || "+0%",
      icon: <UserCheck className="h-4 w-4 text-green-500" />,
    },
    {
      label: "Enrolled Students",
      value: stats?.enrolledStudents.value.toString() || "0",
      change: stats?.enrolledStudents.change || "+0%",
      icon: <BookOpen className="h-4 w-4 text-purple-500" />,
    },
    {
      label: "Supply Agreements",
      value: stats?.supplyAgreements.value.toString() || "0",
      change: stats?.supplyAgreements.change || "+0%",
      icon: <ShoppingCart className="h-4 w-4 text-orange-500" />,
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "interview":
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case "orientation":
        return <GraduationCap className="h-4 w-4 text-purple-500" />
      case "payment":
        return <ShoppingCart className="h-4 w-4 text-orange-500" />
      case "enrollment":
        return <BookOpen className="h-4 w-4 text-green-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  if (isStatsLoading || isAppsLoading || isEventsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Enrollment Dashboard</h2>
      </div>

      <Alert className="mb-6">
        <Bell className="h-4 w-4" />
        <AlertTitle>Enrollment Period</AlertTitle>
        <AlertDescription>
          Fall 2025 enrollment period is now open. Application deadline is June 30, 2025.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {enrollmentStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest student applications received by the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-500">ID</th>
                    <th className="text-left p-3 font-medium text-gray-500">Student</th>
                    <th className="text-left p-3 font-medium text-gray-500">Program</th>
                    <th className="text-left p-3 font-medium text-gray-500">Status</th>
                    <th className="text-left p-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications?.map((application: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{application.id}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={application.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{application.studentName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{application.studentName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{application.program}</td>
                      <td className="p-3">
                        <Badge variant="default">{application.status}</Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              View All Applications
            </Button>
            <Button variant="ghost" size="sm">
              Export
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Scheduled activities and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.map((event: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-1">{getEventIcon(event.type)}</div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(event.date), 'MMM dd, yyyy')} at{" "}
                      {format(new Date(event.date), 'h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default Dashboard