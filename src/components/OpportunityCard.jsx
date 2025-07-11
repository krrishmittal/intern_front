import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApplicationPopup from "./ApplicationPopup";
import { useDarkMode } from "../App";
import { toast } from "react-toastify";
import { MapPin, Clock, DollarSign, ExternalLink, CheckCircle2, Building2 } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders, buildApiUrl } from "../config/api";

function OpportunityCard({ opportunity }) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDarkMode } = useDarkMode();

  // Function to check if user has already applied for this specific opportunity
  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Using endpoint to check for a specific opportunity application
      const response = await fetch(buildApiUrl(API_ENDPOINTS.APPLIED, opportunity.id), {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.applied);
      } else {
        // Fallback to checking all applications if specific endpoint fails
        const allAppsResponse = await fetch(API_ENDPOINTS.APPLIED, {
          headers: getAuthHeaders(),
          credentials: "include",
        });
        
        if (allAppsResponse.ok) {
          const appliedOpportunities = await allAppsResponse.json();
          const hasApplied = appliedOpportunities.some(app => 
            app.id === opportunity.id || app.opportunity_id === opportunity.id
          );
          setHasApplied(hasApplied);
        }
      }
    } catch (error) {
      // Silently handle errors to avoid cluttering console
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Only check application status if user is logged in
    if (token) {
      checkApplicationStatus();
    }
  }, [opportunity.id]);

  const handleApplyClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply for this opportunity");
      return;
    }
    
    // Check application status first to get the latest status
    await checkApplicationStatus();
    
    // Only show popup if not already applied
    if (!hasApplied) {
      setShowPopup(true);
    } else {
      toast.info("You have already applied for this opportunity", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const getCompanyLogo = (companyName) => {
    // Generate a simple logo based on company name
    const firstLetter = companyName.charAt(0).toUpperCase();
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
      'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600'
    ];
    const colorIndex = companyName.length % colors.length;
    return { letter: firstLetter, color: colors[colorIndex] };
  };

  const logo = getCompanyLogo(opportunity.company_name);
  
  // Helper function to get badge class
  const getBadgeClass = () => {
    if (isDarkMode) {
      return 'bg-blue-900 text-blue-300';
    }
    return 'bg-blue-100 text-blue-700';
  };
  
  // Helper function to determine if the opportunity is remote
  const isRemote = () => {
    return opportunity.locations.some(loc => 
      loc.string.toLowerCase().includes("remote") || 
      loc.string.toLowerCase().includes("work from home")
    );
  };

  // Extract location information
  const getLocationString = () => {
    if (opportunity.locations && opportunity.locations.length > 0) {
      return opportunity.locations.map((item) => item.string.trim()).filter((loc) => loc).join(", ");
    }
    return "Remote";
  };

  return (
    <div className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md ${
      isDarkMode
      ? "bg-gray-800/90 backdrop-blur-sm" 
      : "bg-white/80 backdrop-blur-sm"
    } overflow-hidden rounded-lg`}>
      <div className={`absolute inset-0 ${
        isDarkMode
        ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10" 
        : "bg-gradient-to-r from-blue-600/5 to-purple-600/5"
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="p-4 sm:p-6 md:p-8 relative">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1 w-full">
            <div className="flex items-center space-x-3 mb-3">
              {/* Company Logo - maintaining the first letter functionality */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {logo.letter}
                </span>
              </div>
              
              <div>
                <h3 className={`text-lg sm:text-xl font-bold ${
                  isDarkMode
                  ? "text-white group-hover:text-blue-400" 
                  : "text-gray-900 group-hover:text-blue-600"
                } transition-colors`}>
                  {opportunity.title}
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>
                  {opportunity.company_name}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {/* Location */}
              <div className={`flex items-center flex-wrap space-x-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">
                  {getLocationString()}
                </span>
                {isRemote() && (
                  <span className={`${
                    isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"
                  } px-2 py-1 rounded-full text-xs font-medium ml-1`}>
                    Remote
                  </span>
                )}
              </div>
              
              {/* Stipend */}
              <div className={`flex items-center space-x-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  {opportunity.stipend.salary}
                </span>
              </div>
              
              {/* Duration */}
              <div className={`flex items-center space-x-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">
                  {opportunity.duration}
                </span>
              </div>
            </div>
          </div>
          
          {/* Apply Button Area */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-start sm:justify-end space-y-0 space-x-3 sm:space-x-0 sm:space-y-3 w-full sm:w-auto">
            {hasApplied ? (
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Applied</span>
              </div>
            ) : isLoggedIn ? (
              <button 
                onClick={handleApplyClick}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group flex items-center justify-center"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
              </button>
            ) : (
              <Link 
                to="/login"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group flex items-center justify-center"
              >
                <span>Login to Apply</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
          <span className={`${
            isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
          } px-3 py-1 rounded-full text-xs font-medium`}>
            {opportunity.type || 'Full-time'}
          </span>
          {!opportunity.stipend?.salary?.toLowerCase().includes('unpaid') && (
            <span className={`${
              isDarkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"
            } px-3 py-1 rounded-full text-xs font-medium`}>
              Paid
            </span>
          )}
          <span className={`${
            isDarkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-700"
          } px-3 py-1 rounded-full text-xs font-medium`}>
            Growth Opportunity
          </span>
        </div>
      </div>

      {showPopup && (
        <ApplicationPopup 
          opportunity={opportunity} 
          onClose={() => setShowPopup(false)} 
          onApplicationSuccess={() => {
            setHasApplied(true);
            // Toast removed from here to avoid duplication
          }}
        />
      )}
    </div>
  );
}

export default OpportunityCard;
