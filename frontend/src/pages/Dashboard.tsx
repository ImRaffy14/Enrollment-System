import { 
    Bell, 
    Settings, 
    BarChart3, 
    User,
} from "lucide-react";


import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {

    
    const stats = [
        { label: "Total Users", value: "3,721", change: "+5.2%" },
        { label: "Revenue", value: "$12,426", change: "+10.1%" },
        { label: "Active Sessions", value: "842", change: "-3.1%" },
        { label: "Conversion Rate", value: "2.5%", change: "+0.8%" }
    ];
    
    const recentUsers = [
        { name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "Active" },
        { name: "Sarah Miller", email: "sarah@example.com", role: "Editor", status: "Away" },
        { name: "Mike Wilson", email: "mike@example.com", role: "User", status: "Inactive" }
    ];


    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <div>
                    <Button>Export Data</Button> 
                </div>
            </div>
            
            <Alert className="mb-6">
                <Bell className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    System update scheduled for maintenance tonight at 2:00 AM UTC.
                </AlertDescription>
            </Alert>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <Badge variant={stat.change.startsWith('+') ? "default" : "destructive"} className="text-xs">
                            {stat.change}
                            </Badge>
                        </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {/* Recent Users */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>
                        Overview of recently active users and their statuses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                            <th className="text-left p-3 font-medium text-gray-500">User</th>
                            <th className="text-left p-3 font-medium text-gray-500">Role</th>
                            <th className="text-left p-3 font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">
                                <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                </td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                                <Badge variant={
                                    user.status === "Active" ? "default" : 
                                    user.status === "Away" ? "outline" : "secondary"
                                }>
                                    {user.status}
                                </Badge>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">View All Users</Button>
                    <Button variant="ghost" size="sm">Export</Button>
                </CardFooter>
            </Card>
            
            {/* Actions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                        <User size={16} />
                            Add New User
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                            <Settings size={16} />
                            Configure System
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                            <BarChart3 size={16} />
                            Generate Report
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Dashboard
