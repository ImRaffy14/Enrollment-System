import { useState } from "react";
import {  
  Users, 
  BarChart3, 
  LogOut, 
  Menu,
  AppWindow,
  FileSliders,
  FileStack,
  Handshake
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { logout } from "@/api/auth";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user?.role?.includes("ADMIN");

  const baseMenuItems = [
    { id: "dashboard", path: "/", icon: <BarChart3 size={20} />, label: "Dashboard" },
  ];

  const adminMenuItems = [
    { id: "application", path: "/application", icon: <AppWindow size={20} />, label: "Student Application" },
    { id: "admission", path: "/admission", icon: <FileSliders size={20} />, label: "Admission" },
    { id: "registrar", path: "/registrar", icon: <FileStack size={20} />, label: "Registrar" },
    { id: "schoolSuppliesAgreement", path: "/schoolSuppliesAgreement", icon: <Handshake size={20} />, label: "School Supplies Agreement" },
    { id: "users", path: "/users", icon: <Users size={20} />, label: "Users" },
  ];

  const menuItems = [
    ...baseMenuItems,
    ...(isAdmin ? adminMenuItems : []),
  ];

  const handleLogout = async () => {
    try {
      const result = await logout();
      toast.success(result.message);
      navigate('/login');
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className={`bg-white border-r ${collapsed ? "w-16" : "w-64"} flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end
              className={({ isActive }) => 
                `flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 w-full rounded-md ${
                  isActive 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost"
          className={`w-full justify-${collapsed ? "center" : "start"} text-red-600 hover:bg-red-50`}
          onClick={handleLogout}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;