// Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import UserSearch from '../component/UserSearch';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showNewProjectModal, setShowNewProjectModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/project',{
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setProjects(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'in progress':
//         return 'bg-blue-100 text-blue-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'canceled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Sidebar */}
//       <div className="w-64 bg-gray-800 text-white">
//         <div className="p-4">
//           <nav className="space-y-4">
//             <div className="hover:bg-gray-700 p-2 rounded cursor-pointer">
//               Dashboard
//             </div>
//             <div className="hover:bg-gray-700 p-2 rounded cursor-pointer"
//                  onClick={() => navigate('/profile')}>
//               Profile
//             </div>
//             <div className="hover:bg-gray-700 p-2 rounded cursor-pointer"
//                  onClick={() => navigate('/requests')}>
//               Requests
//             </div>
//             <div className="hover:bg-gray-700 p-2 rounded cursor-pointer">
//               Team Management
//             </div>
//             <Link to ='/search'><div className="hover:bg-gray-700 p-2 rounded cursor-pointer">
//                 find users
//             </div>
//             </Link>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto bg-gray-100">
//         {/* Top Header */}
//         <div className="bg-white p-4 shadow flex justify-between items-center">
//           <h1 className="text-2xl font-semibold">Project Dashboard</h1>
//           <button
//             onClick={() => setShowNewProjectModal(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             New Project
//           </button>
//         </div>

//         {/* Project Grid */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map(project => (
//               <ProjectCard 
//                 key={project._id}
//                 project={project}
//                 onUpdate={fetchProjects}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* New Project Modal */}
//       {showNewProjectModal && (
//         <NewProjectModal
//           onClose={() => setShowNewProjectModal(false)}
//           onProjectCreated={() => {
//             fetchProjects();
//             setShowNewProjectModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // ProjectCard Component
// const ProjectCard = ({ project, onUpdate }) => {
//      const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'in progress':
//         return 'bg-blue-100 text-blue-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'canceled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };
//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <div className="flex justify-between items-start">
//         <h3 className="text-lg font-semibold">{project.title}</h3>
//         <span className={`px-2 py-1 rounded text-sm ${
//           getStatusColor(project.status)
//         }`}>
//           {project.status}
//         </span>
//       </div>
//       <p className="text-gray-600 mt-2">{project.description}</p>
//       <div className="mt-4">
//         <h4 className="font-medium">Team Members</h4>
//         <div className="flex mt-2 space-x-2">
//           {project.team.map(member => (
//             <div key={member._id} className="w-8 h-8 rounded-full bg-gray-300">
//               {/* Avatar or initials */}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // New Project Modal Component
// const NewProjectModal = ({ onClose, onProjectCreated }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     status: 'Not Started'
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/project', formData,{
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//            'Content-Type': 'application/json'
//         }
//       });
//       onProjectCreated();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Project Title"
//               className="w-full border p-2 rounded"
//               value={formData.title}
//               onChange={(e) => setFormData({...formData, title: e.target.value})}
//             />
//             <textarea
//               placeholder="Project Description"
//               className="w-full border p-2 rounded"
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//             />
//             <select
//               className="w-full border p-2 rounded"
//               value={formData.status}
//               onChange={(e) => setFormData({...formData, status: e.target.value})}
//             >
//               <option value="Not Started">Not Started</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Under Review">Under Review</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Create Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProjectDashboard = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    tags: []
  });
  const [sortConfig, setSortConfig] = useState({ field: "deadline", direction: "asc" });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/project", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(res.data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatistics = () => {
    const now = new Date();
    setStatistics({
      total: projects.length,
      completed: projects.filter(p => p.status === "Completed").length,
      inProgress: projects.filter(p => p.status === "In Progress").length,
      overdue: projects.filter(p => new Date(p.deadline) < now && p.status !== "Completed").length
    });
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleBulkAction = async (action) => {
    if (!selectedProjects.length) return;
    
    try {
      switch (action) {
        case "delete":
          await Promise.all(selectedProjects.map(id => 
            axios.delete(`http://localhost:5000/project/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
          ));
          break;
        case "complete":
          await Promise.all(selectedProjects.map(id => 
            axios.patch(`http://localhost:5000/project/${id}`, 
              { status: "Completed" },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
            )
          ));
          break;
      }
      fetchProjects();
      setSelectedProjects([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = () => {
    return projects
      .filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status.length === 0 || filters.status.includes(project.status);
        const matchesPriority = filters.priority.length === 0 || filters.priority.includes(project.priority);
        const matchesTags = filters.tags.length === 0 || 
                           project.tags?.some(tag => filters.tags.includes(tag));
        return matchesSearch && matchesStatus && matchesPriority && matchesTags;
      })
      .sort((a, b) => {
        const factor = sortConfig.direction === "asc" ? 1 : -1;
        return a[sortConfig.field] > b[sortConfig.field] ? factor : -factor;
      });
  };


  return (
     <div className="h-screen overflow-y-auto p-8">
        
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
 <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-20 rounded-xl shadow-lg p-5 mb-8">
  <div className="flex flex-row gap-6 items-center h-full">
    {/* Search Input */}
    <div className="relative flex-1">
      <input
        type="text"
        placeholder=" Search projects..."
        className="w-full p-3 pl-10 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔎</span>
    </div>

    {/* Status Dropdown */}
    <div className="relative">
      <select
        className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">📌 Status</option>
        <option value="Not Started">⏳ Not Started</option>
        <option value="In Progress">🚀 In Progress</option>
        <option value="Completed">✅ Completed</option>
      </select>
    </div>

    {/* Priority Dropdown */}
    <div className="relative">
      <select
        className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">⚡ Priority</option>
        <option value="Low">🟢 Low</option>
        <option value="Medium">🟡 Medium</option>
        <option value="High">🔴 High</option>
      </select>
    </div>

    {/* New Project Button */}
    <button
      onClick={() => setShowNewProjectModal(true)}
      className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 shadow-md flex items-center gap-2"
    >
      ➕ New Project
    </button>
  </div>
</div>


      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-8 flex items-center justify-between">
          <span>{selectedProjects.length} projects selected</span>
          <div className="space-x-4">
            <button
              onClick={() => handleBulkAction("complete")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Mark Complete
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects().map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project._id)}
                    onChange={(e) => {
                      setSelectedProjects(prev =>
                        e.target.checked
                          ? [...prev, project._id]
                          : prev.filter(id => id !== project._id)
                      );
                    }}
                    className="mr-3 mt-1"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.status === "Completed" ? "bg-green-100 text-green-800" :
                        project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.priority === "High" ? "bg-red-100 text-red-800" :
                        project.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Due: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                    <Link to={`/project/${project._id}`}>
                <button
                  onClick={() => setProjectId(project._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
                </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={() => {
            fetchProjects();
            setShowNewProjectModal(false);
          }}
        />
      )}
    </div>
  );
};


const NewProjectModal = ({ onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started",
    deadline: "",
    priority: "Medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/project", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      onProjectCreated();
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Project Description"
            className="w-full border p-2 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ),
    },
    {
      title: "Project Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Deadline
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level
            </label>
            <select
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex mb-2 justify-between">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 ${
                  index < steps.length - 1 ? "mr-2" : ""
                }`}
              >
                <div
                  className={`h-2 rounded-full ${
                    step > index
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Step {step} of {steps.length}: {steps[step - 1].title}
          </div>
        </div>

        {steps[step - 1].content}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Back
            </button>
          )}
          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
            >
              Create Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
