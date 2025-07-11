import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDarkMode } from '../App';
import { API_ENDPOINTS, getAuthHeaders, buildApiUrl } from '../config/api';

const Profile = () => {
  const { isDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [editingProject, setEditingProject] = useState(null);  
  const [editProjectData, setEditProjectData] = useState({ title: '', description: '', link: '' });  
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      let isAuthenticated = true;

      try {
        const userResponse = await fetch(API_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
          signal,
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setUsername(userData.name || userData.username);
          setLinkedin(userData.linkedin || '');
        } else {
          isAuthenticated = false;
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching user data:', error);
          isAuthenticated = false;
        }
      }

      if (!isAuthenticated) {
        toast.error('Please Login to view profile');
        navigate('/login');
        return;
      }

      // Fetch skills
      try {
        const skillsResponse = await fetch(API_ENDPOINTS.PROFILE_SKILLS, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
          signal,
        });

        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData.skills);
          setSkillsText(skillsData.skills.join(', '));
        } else {
          toast.error('Failed to fetch skills');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching skills:', error);
          toast.error('Failed to fetch skills');
        }
      }

      // Fetch projects
      try {
        const projectsResponse = await fetch(API_ENDPOINTS.PROFILE_PROJECTS, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
          signal,
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects);
        } else {
          toast.error('Failed to fetch projects');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching projects:', error);
          toast.error('Failed to fetch projects');
        }
      }
    };
    fetchData();
    return () => controller.abort();
  }, [navigate]);

  useEffect(() => {
    setSkillsText(skills.join(', '));
  }, [skills]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Skill cannot be empty");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_SKILLS, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ skill: newSkill }),
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
        setNewSkill("");
        toast.success("Skill added successfully");
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleUpdateSkills = async () => {
    const updatedSkills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_SKILLS, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ skills: updatedSkills }),
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
        toast.success("Skills updated successfully");
        setIsEditingSkills(false);
      } else {
        toast.error("Failed to update skills");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('User and associated data deleted successfully!');
        navigate('/signup');
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (username.trim() === '') {
      toast.error('Username cannot be empty');
      return;
    }

    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength || 
        !hasNumber.test(password) || 
        !hasUpperCase.test(password) || 
        !hasSpecialChar.test(password)) {
      toast.error('Password must be at least 8 characters long, include at least one number, one uppercase letter, and one special character.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username,
          password,
          linkedin, 
        }),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success('User data updated successfully');
        setIsEditingProfile(false);
      } else {
        toast.error('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.link) {
      toast.error("Project title and link cannot be empty");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_PROJECTS, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        const data = await response.json(); 
        setProjects(prevProjects => [...prevProjects, data.projects[data.projects.length - 1]]);  
        setNewProject({ title: '', description: '', link: '' });
        toast.success("Project added successfully");
      } else {
        toast.error("Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectData({ title: project.title, description: project.description, link: project.link });
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_PROJECTS, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData.projects);
      } else {
        toast.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  const handleUpdateProject = async () => {
    if (!editProjectData.title || !editProjectData.link) {
      toast.error("Project title and link cannot be empty");
      return;
    }

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.PROFILE_PROJECTS, editingProject._id), {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(editProjectData),
      });

      if (response.ok) {
        await response.json();  
        await fetchProjects(); 
        setEditProjectData({ title: '', description: '', link: '' });
        setEditingProject(null);
        toast.success("Project updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.PROFILE_PROJECTS, projectId), {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (response.ok) {
        setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
        toast.success("Project deleted successfully");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setEditProjectData({ title: '', description: '', link: '' });
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className={`rounded-lg shadow-sm border p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account settings and preferences</p>
              </div>
            </div>
          </div>

          {user ? (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</span>
                  </div>
                  <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name || user.username || 'No Name Available'}</p>
                </div>

                <div className={`rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</span>
                  </div>
                  <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                </div>

                <div className={`rounded-lg p-4 md:col-span-2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>LinkedIn</span>
                  </div>
                  <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{linkedin || 'No LinkedIn profile added'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{isEditingProfile ? 'Cancel Update' : 'Edit Profile'}</span>
                </button>
                
                <button 
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3m8 0H4" />
                  </svg>
                  <span>Delete Account</span>
                </button>
              </div>

              {/* Edit Profile Form */}
              {isEditingProfile && (
                <div className={`border rounded-lg p-6 mt-6 transition-colors duration-300 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                        <input 
                          type="text" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          required 
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                            isDarkMode 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                            isDarkMode 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>LinkedIn</label>
                        <input 
                          type="text" 
                          value={linkedin} 
                          onChange={(e) => setLinkedin(e.target.value)} 
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                            isDarkMode 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
              <span className={`ml-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading user data...</span>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className={`rounded-lg shadow-sm border p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
            </div>
            <button 
              onClick={() => setIsEditingSkills(!isEditingSkills)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isEditingSkills ? 'Cancel Edit' : 'Edit Skills'}
            </button>
          </div>

          {/* Skills Display */}
          <div className="flex flex-wrap gap-3 mb-6">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
              >
                {skill}
              </span>
            ))}
            {skills.length === 0 && (
              <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No skills added yet. Add your first skill below!</p>
            )}
          </div>

          {/* Add Skill */}
          <div className="flex space-x-4 mb-6">
            <input 
              type="text" 
              placeholder="Add a new skill" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button 
              onClick={handleAddSkill}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Skill
            </button>
          </div>

          {/* Edit Skills */}
          {isEditingSkills && (
            <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Skills</h3>
              <textarea 
                value={skillsText} 
                onChange={(e) => setSkillsText(e.target.value)} 
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter skills separated by commas"
              />
              <button 
                onClick={handleUpdateSkills}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Update Skills
              </button>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className={`rounded-lg shadow-sm border p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Projects</h2>
          </div>

          {/* Projects List */}
          <div className="space-y-6 mb-8">
            {projects.map((project, index) => (
              <div key={index} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      <span>View Project</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => handleEditProject(project)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project._id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-red-900 hover:bg-red-800 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Edit Project Form */}
                {editingProject && editingProject._id === project._id && (
                  <div className={`border rounded-lg p-6 mt-4 transition-colors duration-300 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                    <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Project</h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={editProjectData.title}
                        onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <textarea
                        placeholder="Project Description"
                        value={editProjectData.description}
                        onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-300 ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Project Link"
                        value={editProjectData.link}
                        onChange={(e) => setEditProjectData({ ...editProjectData, link: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <div className="flex space-x-4">
                        <button 
                          onClick={handleUpdateProject}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Update Project
                        </button>
                        <button 
                          onClick={cancelEditProject}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {projects.length === 0 && (
              <div className={`text-center py-12 border rounded-lg transition-colors duration-300 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <svg className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No projects added yet. Add your first project below!</p>
              </div>
            )}
          </div>

          {/* Add Project Form */}
          <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Project</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <input
                type="text"
                placeholder="Project Link"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <button 
                onClick={handleAddProject}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-xl max-w-md w-full p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Account</h3>
              </div>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={cancelDelete}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex-1 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
