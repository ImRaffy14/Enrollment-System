import { Routes, Route, Navigate, useLocation, Outlet} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import UserManagement from "./pages/UserManagement";
import ApplicationManagement from "./pages/Application";
import RegistrarManagement from "./pages/Registrar";
import WithSocket from "./components/WithSocket";
import FullPageLoader from "./components/FullpageLoader";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/authContext";
import React, { ReactNode } from "react"

interface ProtectedRouteProps {
  roles?: string[];
  redirectPath?: string;
  children?: ReactNode;
}

type AppRoute = {
  path: string;
  public?: boolean;
  element: React.ReactNode;
  children?: AppRoute[];
  roles?: string[];
};

const ProtectedRoute = ({ 
  roles, 
  redirectPath = "/login",
  children 
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (roles && !roles.some(role => user.role?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};


function App() {
  const { isLoading, user } = useAuth();

  if (isLoading) return (
    <div className="h-screen">
      <FullPageLoader message={'Authenticating'} showLogo={true}/>
    </div>
  );

  const routes: AppRoute[] = [

    // Public Routes
    { 
      path: "/login", 
      public: true, 
      element: user ? <Navigate to="/" replace /> : <Login /> 
    },

    // Protected Routes
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <WithSocket>
            <MainLayout />
          </WithSocket>
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { 
          path: "users", 
          element: <UserManagement />,
          roles: ["ADMIN"] 
        },
        { 
          path: "application", 
          element: <ApplicationManagement />,
          roles: ["ADMIN"] 
        },
                { 
          path: "registrar", 
          element: <RegistrarManagement />,
          roles: ["ADMIN"] 
        },
      ],
    },
  ];
  
  const renderRoutes = (routes: AppRoute[]) => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          route.public 
            ? route.element 
            : (
              <ProtectedRoute roles={route.roles}>
                {route.element}
              </ProtectedRoute>
            )
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>{renderRoutes(routes)}</Routes>
    </>
  );
}


export default App;