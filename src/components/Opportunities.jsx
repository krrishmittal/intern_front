import React, { useState } from "react";
import OpportunitiesData from "../opportunities.json";
import OpportunityCard from "./OpportunityCard";
import { useDarkMode } from "../App";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  TrendingUp,
  Briefcase,
  Star
} from "lucide-react";
import "./animations.css";

function Opportunities() {
  const { isDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const stats = {
    activeOpportunities: "500+",
    successRate: "85%",
    responseTime: "24h"
  };

  const filteredOpportunities = Object.values(OpportunitiesData.internships_meta).filter(
    (opportunity) => {
      const matchesSearchQuery =
        opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.company_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = locationFilter
        ? opportunity.locations.length > 0 &&
          opportunity.locations.some((loc) =>
            loc.string.toLowerCase() === locationFilter.toLowerCase()
          )
        : true;

      const matchesDuration = durationFilter
        ? opportunity.duration.toLowerCase().includes(durationFilter.toLowerCase())
        : true;

      const matchesStipend = stipendFilter
        ? opportunity.stipend.salary.toLowerCase().includes(stipendFilter.toLowerCase())
        : true;

      const matchesActiveFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "remote"
          ? opportunity.locations.some((loc) =>
              loc.string.toLowerCase().includes("remote")
            )
          : activeFilter === "paid"
          ? !opportunity.stipend.salary.toLowerCase().includes("unpaid")
          : activeFilter === "tech"
          ? opportunity.title.toLowerCase().includes("developer") ||
            opportunity.title.toLowerCase().includes("engineer")
          : activeFilter === "marketing"
          ? opportunity.title.toLowerCase().includes("marketing")
          : true;

      return (
        matchesSearchQuery &&
        matchesLocation &&
        matchesDuration &&
        matchesStipend &&
        matchesActiveFilter
      );
    }
  );

  return (
    <div className={`min-h-screen ${
      isDarkMode 
      ? "bg-gradient-to-br from-gray-900 via-gray-800/30 to-indigo-950/20" 
      : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20"
    }`}>
      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        ></div>
      )}
      
      {/* Mobile Filters Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-3/4 max-w-xs z-50 transform ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden ${
        isDarkMode 
        ? "bg-gray-800 border-r border-gray-700" 
        : "bg-white border-r border-gray-100"
      } p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h2 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>Filters</h2>
          </div>
          <button 
            onClick={() => setMobileFiltersOpen(false)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Same filter content as desktop */}
        <div className="space-y-8">
          {/* Search */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
              <Search className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
              <span>Search Opportunities</span>
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-3 h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="e.g. Software Engineer, Marketing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 py-3 px-4 ${
                  isDarkMode 
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                  : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
              <MapPin className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
              <span>Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Remote, Bangalore..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`px-4 py-3 ${
                isDarkMode 
                ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
              } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
              <Clock className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
              <span>Duration</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 2-3 months, 6 months..."
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className={`px-4 py-3 ${
                isDarkMode 
                ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
              } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
            />
          </div>

          {/* Stipend */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
              <DollarSign className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
              <span>Stipend Range</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ₹15,000 - ₹30,000"
              value={stipendFilter}
              onChange={(e) => setStipendFilter(e.target.value)}
              className={`px-4 py-3 ${
                isDarkMode 
                ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
              } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
            />
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
              <Star className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
              <span>Quick Filters</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "Remote", "Paid", "Tech", "Marketing"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter.toLowerCase())}
                  className={`rounded-full text-xs ${
                    activeFilter === filter.toLowerCase()
                      ? "bg-blue-600 text-white"
                      : isDarkMode 
                        ? "border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  } h-9 px-3`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchQuery("");
              setLocationFilter("");
              setDurationFilter("");
              setStipendFilter("");
              setActiveFilter("all");
              setVisibleCount(5);
              setMobileFiltersOpen(false);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-12 font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </aside>
      
      <div className="flex">
        {/* Desktop Sidebar Filters */}
        <aside className={`hidden lg:block w-80 ${
          isDarkMode 
          ? "bg-gray-800/90 backdrop-blur-sm border-r border-gray-700" 
          : "bg-white/90 backdrop-blur-sm border-r border-gray-100"
        } p-6 h-screen sticky top-0 overflow-y-auto`}>
          <div className="space-y-8">
            {/* Filters Header */}
            <div className="flex items-center space-x-2">
              <Filter className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              <div>
                <h2 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Filters</h2>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Find your perfect match</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="space-y-3">
              <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
                <Search className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
                <span>Search Opportunities</span>
              </label>
              <div className="relative">
                <Search className={`absolute left-3 top-3 h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Marketing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 py-3 px-4 ${
                    isDarkMode 
                    ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                    : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                  } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
                <MapPin className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
                <span>Location</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Remote, Bangalore..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className={`px-4 py-3 ${
                  isDarkMode 
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                  : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
              />
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
                <Clock className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
                <span>Duration</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2-3 months, 6 months..."
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className={`px-4 py-3 ${
                  isDarkMode 
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                  : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
              />
            </div>

            {/* Stipend */}
            <div className="space-y-3">
              <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
                <DollarSign className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
                <span>Stipend Range</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ₹15,000 - ₹30,000"
                value={stipendFilter}
                onChange={(e) => setStipendFilter(e.target.value)}
                className={`px-4 py-3 ${
                  isDarkMode 
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
                  : "border border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                } focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 w-full`}
              />
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <label className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center space-x-2`}>
                <Star className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : ""}`} />
                <span>Quick Filters</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Remote", "Paid", "Tech", "Marketing"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter.toLowerCase())}
                    className={`rounded-full text-xs ${
                      activeFilter === filter.toLowerCase()
                        ? "bg-blue-600 text-white"
                        : isDarkMode 
                          ? "border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600" 
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    } h-9 px-3`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("");
                setDurationFilter("");
                setStipendFilter("");
                setActiveFilter("all");
                setVisibleCount(5);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-12 font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${
          isDarkMode 
          ? "bg-gradient-to-br from-gray-900 to-indigo-900/30" 
          : "bg-gradient-to-br from-gray-50 to-blue-50/30"
        } min-h-screen`}>
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-4xl font-bold ${
                    isDarkMode 
                    ? "bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  }`}>
                    Internship Opportunities
                  </h1>
                </div>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-lg max-w-2xl mx-auto`}>
                  Discover amazing internship opportunities from top companies and kickstart your career journey
                </p>
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className={`lg:hidden mt-4 px-4 py-2 rounded-xl flex items-center gap-2 mx-auto ${
                    isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } text-sm font-medium`}
                >
                  <Filter className="w-4 h-4" />
                  Filter Opportunities
                </button>

                <div className="flex items-center justify-center space-x-8 mt-8">
                  <div className="text-center">
                    <div className={`flex items-center space-x-1 text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <TrendingUp className="w-6 h-6" />
                      <span>{stats.activeOpportunities}</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Active Opportunities</p>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{stats.successRate}</div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Success Rate</p>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>{stats.responseTime}</div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Avg Response Time</p>
                  </div>
                </div>
              </div>

              {/* Opportunity Cards */}
              <div className="space-y-4 sm:space-y-6">
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.slice(0, visibleCount).map((opportunity, index) => (
                    <div
                      key={opportunity.id}
                      className="animate-fade-in hover:transform hover:scale-[1.01] transition-transform duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <OpportunityCard opportunity={opportunity} />
                    </div>
                  ))
                ) : (
                  <div className={`${
                    isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200"
                  } rounded-xl p-12 text-center shadow-sm border`}>
                    <div className={`w-16 h-16 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Search className={`w-8 h-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      No opportunities found
                    </h3>
                    <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Try adjusting your filters to find more opportunities
                    </p>
                    <button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                      onClick={() => {
                        setSearchQuery("");
                        setLocationFilter("");
                        setDurationFilter("");
                        setStipendFilter("");
                        setActiveFilter("all");
                        setVisibleCount(5);
                      }}
                    >
                      Reset Search
                    </button>
                  </div>
                )}

                {filteredOpportunities.length > visibleCount && (
                  <div className="text-center mt-8 sm:mt-12">
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 5)}
                      className={`${
                        isDarkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                      } flex items-center justify-center gap-2 mx-auto font-semibold py-3 px-8 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md`}
                    >
                      <span>Load More Opportunities</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Opportunities;
