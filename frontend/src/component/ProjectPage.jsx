import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Clock, 
  Flag, 
  Users, 
  FileText, 
  MessageSquare, 
  Tag,
  Plus,
  CheckSquare,
  ChevronDown,
  Share2,
  MoreHorizontal,
  Calendar
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTeamModal, setShowTeamModal] = useState(false);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/project/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProject(response.data);
        console.log('Fetched project:', response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const today = new Date();
  const deadline = new Date(project.deadline);
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const timeDifference = deadline.getTime() - today.getTime();
  const timeleft = Math.floor(timeDifference / (1000 * 60 * 60 ));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));



  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statusColors = {
    'Not Started': 'bg-gray-200 text-gray-800',
    'In Progress': 'bg-blue-200 text-blue-800',
    'Under Review': 'bg-yellow-200 text-yellow-800',
    'Completed': 'bg-green-200 text-green-800',
    'On Hold': 'bg-red-200 text-red-800'
  };

  const priorityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{project.description}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Share2 size={16} />
                Share
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Project Meta */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className={`px-3 py-1 rounded-full text-sm ${statusColors[project.status]}`}>
              {project.status}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${priorityColors[project.priority]}`}>
              {project.priority} Priority
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              {new Date(project.deadline).toLocaleDateString()}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex gap-6 border-b">
            {['overview', 'tasks', 'files', 'discussion', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Project Overview</h2>
                <div className="space-y-4">
                  <p>{project.description}</p>
                  {project.labels.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {project.labels.map((label, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium">Tasks</h2>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
                <div className="p-4">
                  {project.tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks created yet</p>
                  ) : (
                    <div className="space-y-3">
                      {project.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                          <CheckSquare size={20} className="text-gray-400" />
                          <div className="flex-1">
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Team & Stats */}
          <div className="space-y-6">
            {/* Team Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Team</h2>
                <button 
                  onClick={() => setShowTeamModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Invite Members
                </button>
              </div>
              <div className="space-y-3">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Project Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasks Completed</p>
                  <p className="text-lg font-medium">12/20</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className="text-lg font-medium">{timeleft} hours {minutes} minutes</p>
                  <p className="text-sm text-gray-500">Days Remaining</p>
                  

                  <p className="text-lg font-medium">{daysRemaining}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;