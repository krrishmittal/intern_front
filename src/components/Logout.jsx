import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDarkMode } from "../App";

function Logout() {
    const navigate = useNavigate();
    const hasLoggedOut = useRef(false);
    const [isLoggingOut, setIsLoggingOut] = useState(true);
    const { isDarkMode } = useDarkMode();
    
    useEffect(() => { 
        const logoutUser = async () => {
            if (hasLoggedOut.current) return; 
            hasLoggedOut.current = true;
            
            try {
                // Make sure token is removed
                localStorage.removeItem("token");
                
                // Clear any other auth-related storage
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
                
                const response = await fetch("http://localhost:4000/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });
                
                await response.json();
                
                if (response.ok) {
                    toast.success("Logout Successful");
                    setIsLoggingOut(false);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                } else {
                    toast.error("Already logged out. Please login");
                    setIsLoggingOut(false);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                }
            } catch (error) {
                toast.error(error.message);
                setIsLoggingOut(false);
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        };
        
        logoutUser();
    }, [navigate]);
    
    if (isLoggingOut) {
        return (
            <div className={`min-h-screen ${
                isDarkMode 
                ? "bg-gradient-to-br from-gray-900 to-gray-800" 
                : "bg-gradient-to-br from-blue-50 to-purple-50"
            } flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-md w-full text-center">
                    <div className={`${
                        isDarkMode 
                        ? "bg-gray-800/80 border-gray-700" 
                        : "bg-white/80 border-gray-200"
                    } backdrop-blur-sm border rounded-2xl shadow-xl p-8`}>
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                            Logging you out...
                        </h2>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                            Please wait while we securely log you out
                        </p>
                        <div className="flex justify-center">
                            <div className="animate-pulse flex space-x-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen ${
            isDarkMode 
            ? "bg-gradient-to-br from-gray-900 to-gray-800" 
            : "bg-gradient-to-br from-blue-50 to-purple-50"
        } flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-md w-full text-center">
                <div className={`${
                    isDarkMode 
                    ? "bg-gray-800/80 border-gray-700" 
                    : "bg-white/80 border-gray-200"
                } backdrop-blur-sm border rounded-2xl shadow-xl p-8`}>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Successfully Logged Out
                    </h2>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
                        You have been safely logged out of your account.
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
                        Redirecting to login page...
                    </p>
                    <div className="flex justify-center">
                        <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Logout;
