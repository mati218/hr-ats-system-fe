import { Routes, Route } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import CareerPortal from "../pages/CareerPortal/CareerPortal";
import { useAuth } from "../context/useAuth";

const MainRoutes = () => {
    const { token } = useAuth();
    const isAuthenticated = Boolean(token);
    console.log("isAuthenticated:", isAuthenticated);


    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/career-portal"
                element={<CareerPortal />}
            />

            {isAuthenticated ? (
                <ProtectedRoutes />
                
            ) : (
                <>
                    {/* Authentication Routes */}
                    <AuthRoutes />
                </>
            )}
        </Routes>
    );
};

export default MainRoutes;