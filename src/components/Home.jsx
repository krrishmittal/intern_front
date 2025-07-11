import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../App";
import { 
  ArrowRight,
  User, 
  Star, 
  Heart, 
  Users,
  Building2, 
  TrendingUp, 
  CheckCircle, 
  DollarSign, 
  BookOpen,
  Package,
  Zap,
  Award,
  Target
} from "lucide-react";
import "./animations.css";

function Home() {
  const { isDarkMode } = useDarkMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Special features section data
  const specialFeatures = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Our advanced AI system analyzes your skills, interests, and career goals to find the perfect internship matches.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Skill Development Hub",
      description: "Access exclusive learning resources, workshops, and mentorship programs designed to accelerate your growth.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Career Analytics",
      description: "Track your progress with detailed analytics and build a portfolio that showcases your achievements.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Premium partners section data
  const premiumFeatures = [
    {
      icon: Heart,
      title: "Premium Partners",
      description: "Work with vetted companies that provide meaningful, educational experiences and potential full-time offers.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Join thousands of interns, mentors, and industry professionals in our thriving career network.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Package,
      title: "Diverse Opportunities",
      description: "From innovative startups to Fortune 500 companies, discover internships across every industry imaginable.",
      color: "from-green-500 to-teal-500"
    }
  ];

  // Statistics section data for display
  const statsData = [
    {
      icon: Users,
      number: "10,000+",
      label: "Students Placed",
      description: "Successful internship placements",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Building2,
      number: "500+",
      label: "Partner Companies",
      description: "From startups to Fortune 500",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
      description: "Students completing internships",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      number: "4.8/5",
      label: "Average Rating",
      description: "From students and employers",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Testimonials from students
  const testimonials = [
    {
      name: "Sarah Chen",
      company: "Google",
      avatar: "SC",
      avatarColor: "from-purple-500 to-pink-500",
      text: "InternHub connected me with an amazing startup where I learned more in 3 months than I did in 2 years of university. The experience was transformative."
    },
    {
      name: "Marcus Johnson",
      company: "TechStart",
      avatar: "MJ",
      avatarColor: "from-blue-500 to-purple-500",
      text: "The AI matching system found me opportunities I never knew existed. I went from intern to CMO in just 3 years thanks to the foundation InternHub provided."
    },
    {
      name: "Priya Patel",
      company: "Meta",
      avatar: "PP",
      avatarColor: "from-pink-500 to-purple-500",
      text: "InternHub didn't just find me an internship - they found me a career path. The skill development resources and mentorship were game-changing."
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-indigo-950/30 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
        <div className="max-w-7xl mx-auto text-center">
          {/* Success Badge */}
          <div className={`inline-flex items-center space-x-2 ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} px-4 py-2 rounded-full text-sm font-medium mb-8`}>
            <CheckCircle className="w-4 h-4" />
            <span>Thousands of new opportunities added daily</span>
          </div>
          
          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Perfect</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Internship</span>
            <br />
            Opportunity
          </h1>
          
          {/* Subheading */}
          <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-12`}>
            Connect with top companies worldwide. Discover opportunities that match your skills and career goals. 
            Take the first step towards your dream career.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button 
              onClick={() => navigate('/opportunities')}
              className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl w-full sm:w-auto flex items-center justify-center`}
            >
              Find Opportunities <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link 
              to="/employer-signup" 
              className={`${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} px-8 py-3 text-lg font-semibold rounded-xl border-2 w-full sm:w-auto`}
            >
              I'm an Employer
            </Link>
          </div>
          
          {/* Statistics Cards */}
          <div className="flex flex-wrap justify-center items-stretch gap-8">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">F</span>
                </div>
              </div>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>10,000+ students placed in the last year</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-2xl flex items-center justify-center`}>
                <Users className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hiring Companies</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>500+ Partners</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-2xl flex items-center justify-center`}>
                <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average Stipend</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rs 30,000/month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              <span>Why Choose InternHub?</span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Special</span>?
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto`}>
              We've revolutionized the internship experience by creating a platform that truly understands both students and employers, 
              fostering meaningful connections that launch careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {specialFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{feature.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {premiumFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{feature.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Numbers That <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Inspire</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Our impact speaks for itself, but our students' success stories speak even louder.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/10'} backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                  <p className="text-xl font-semibold text-gray-300 mb-2">{stat.label}</p>
                  <p className="text-gray-400">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-white">Success Stories</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/10'} backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300`}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.avatarColor} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-300 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathway Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-purple-600 via-blue-700 to-purple-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>Ready to Transform Your Career?</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
              Whether you're a student seeking life-changing opportunities or a company looking for exceptional talent, 
              InternHub is your gateway to success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">I'm a Student</h3>
              <p className="text-gray-300 text-lg mb-8">
                Discover internships that match your passion and potential. Connect with top companies and accelerate your career journey.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">AI-powered job matching and career guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Access to exclusive mentorship programs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Build your professional portfolio and network</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/opportunities')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center"
              >
                Find My Dream Internship
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            {/* Employer Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">I'm an Employer</h3>
              <p className="text-gray-300 text-lg mb-8">
                Find exceptional students who are eager to contribute and grow. Build your future workforce with pre-screened, motivated talent.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Access to top-tier, pre-screened candidates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Streamlined hiring and management tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Build long-term talent pipeline for your company</span>
                </div>
              </div>
              
              <Link 
                to="/employer-signup" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center"
              >
                Hire Top Talent Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-300">
              Questions? <Link to="/contact" className="text-white underline font-medium">Contact our support team</Link> - we're here to help you succeed!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
