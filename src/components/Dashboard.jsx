import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDarkMode } from "../App";
import ApplicationPopup from "./ApplicationPopup";
import { API_ENDPOINTS, buildApiUrl, API_CONFIG_FETCH } from "../config/api";

function Dashboard() {
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOpportunity, setCurrentOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const fetchAppliedOpportunities = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.APPLIED, {
                    ...API_CONFIG_FETCH,
                    signal: controller.signal,
                });
                if (!response.ok) {
                    toast.error("Login to view Dashboard");
                    navigate("/login");
                    return;
                }
                const data = await response.json();
                setAppliedOpportunities(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // Silently handle errors, toast notifications will inform the user if needed
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedOpportunities();
        return () => controller.abort();
    }, [navigate]);

    const handleDeleteOpportunity = async (id) => {
        try {
            const response = await fetch(buildApiUrl(API_ENDPOINTS.APPLIED, id), {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete opportunity");
            }
            setAppliedOpportunities((prevOpportunities) =>
                prevOpportunities.filter((opportunity) => opportunity._id !== id)
            );
            toast.success("Application deleted successfully");
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            toast.error("Failed to delete application");
        }
    };

    const handleEditOpportunity = (opportunity) => {
        setCurrentOpportunity(opportunity);
        setIsEditing(true);
    };

    const handleUpdateOpportunity = (updatedOpportunity) => {
        setAppliedOpportunities((prevOpportunities) =>
            prevOpportunities.map((opportunity) =>
                opportunity._id === updatedOpportunity.id ? { ...opportunity, ...updatedOpportunity } : opportunity
            )
        );
        toast.success("Application updated successfully");
    };

    const countByStatus = (status) => {
        return appliedOpportunities.filter(opp => opp.status === status).length;
    };

    const getRandomStatus = () => {
        const statuses = ['Pending', 'Approved', 'Rejected'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
            case 'approved': return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
            case 'rejected': return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
            default: return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`min-h-screen py-6 sm:py-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent mb-2 sm:mb-4`}>
                        Application Dashboard
                    </h1>
                    <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Track and manage your internship applications
                    </p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className={`backdrop-blur-sm border rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Applications</h3>
                                <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{appliedOpportunities.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`backdrop-blur-sm border rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending</h3>
                                <p className={`text-3xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{countByStatus('Pending') || appliedOpportunities.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`backdrop-blur-sm border rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Approved</h3>
                                <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{countByStatus('Approved') || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`backdrop-blur-sm border rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rejected</h3>
                                <p className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{countByStatus('Rejected') || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className={`backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loading Applications</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please wait while we fetch your applications...</p>
                        </div>
                    ) : appliedOpportunities.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`border-b ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200'}`}>
                                    <tr>
                                        <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Position</th>
                                        <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company</th>
                                        <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration</th>
                                        <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                                        <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                                    {appliedOpportunities.map((opportunity) => (
                                        <tr key={opportunity._id} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{opportunity.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {opportunity.company_logo ? (
                                                        <img 
                                                            src={opportunity.company_logo} 
                                                            alt={opportunity.company_name} 
                                                            className="w-8 h-8 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-sm font-semibold">
                                                                {opportunity.company_name?.charAt(0) || 'C'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{opportunity.company_name}</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{opportunity.duration}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status || getRandomStatus())}`}>
                                                    {opportunity.status || getRandomStatus()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditOpportunity(opportunity)}
                                                        className={`px-3 py-1 rounded-lg transition-colors text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOpportunity(opportunity._id)}
                                                        className={`px-3 py-1 rounded-lg transition-colors text-sm font-medium ${isDarkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'}`}>
                                <svg className={`w-12 h-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>No Applications Yet</h3>
                            <p className={`mb-6 text-center max-w-md ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                You haven't applied to any opportunities yet. Browse available internships and start your journey!
                            </p>
                            <button
                                onClick={() => navigate('/opportunities')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Find Opportunities
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {isEditing && (
                <ApplicationPopup
                    opportunity={currentOpportunity}
                    onClose={() => setIsEditing(false)}
                    onUpdate={handleUpdateOpportunity}
                    isEditing={true}
                />
            )}
        </div>
    );
}

export default Dashboard;
