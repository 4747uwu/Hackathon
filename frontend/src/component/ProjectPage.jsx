import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InviteTeamModal from '../component/InviteTeamModal';
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
  Calendar,
  Milestone
} from 'lucide-react';
import ProjectDiscussion from './ProjectDiscussion';
import FileUploader from './FileUploader';

const ProjectDetails = () => {
  const { id } = useParams();
  console.log('Project ID:', id); // Debug log
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/project/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials:true
      });
      setProject(response.data);
      console.log("Fetched project:", response.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  // Fetch project data
  useEffect(() => {
    

    fetchProject();
  }, [id]); // Runs once when `id` changes

  const fetchTasks = async () => {
    try {
      const taskResponses = await Promise.all(
        project.tasks.map(async (taskId) => {
          const response = await axios.get(`http://localhost:5000/task/${taskId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          });
          return response.data;
        })
      );
      setTasks(taskResponses);
      console.log("Fetched tasks:", taskResponses);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch task details once project is available
  useEffect(() => {
    if (!project || !project.tasks || project.tasks.length === 0) return; // Ensure project & tasks exist

    

    fetchTasks();
  }, [project]); // Runs when project updates

  // Calculate completed tasks when `tasks` update
  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    setCompletedCount(completedTasks);
  }, [tasks]); // Runs when `tasks` update

  if (!project) {
    return <div>Loading...</div>;
  }

  console.log("Completed tasks:", completedCount);


  const markTaskAsCompleted = async (taskId) => {
    try {
      console.log("Completing Task:", taskId); // Debugging output
  
      const response = await axios.put(
        `http://localhost:5000/task/complete/${taskId}`,
        {}, // No request body needed since we're updating status in the backend
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true
        }
      );
  
      fetchProject();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await axios.put(
        `http://localhost:5000/task/assign/${taskId}`,
        { assignedTo: userId || null }, // Send null if "None" is selected
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        }
      );
      fetchProject();
      console.log(`Task ${taskId} assigned to ${userId || "None"}`);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };
  

  <InviteTeamModal 
  isOpen={showTeamModal}
  onClose={() => setShowTeamModal(false)}
  projectId={project._id}
/>
console.log('Project:', project); // Debug log

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
                <MilestoneTracker projectId={project._id}/>
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium">Tasks</h2>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={() => setShowNewTaskModal(true)}>
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
                <div className="p-4">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks created yet</p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg" >
                          <CheckSquare
                            size={20}
                            className={task.status === "completed" ? "text-green-500" : "text-gray-400"}
                        />
                          <div className="flex-1" onClick={(e) => {markTaskAsCompleted(task._id)}}>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.description}</p>
                            <p className="text-sm text-gray-500">status:{task.status}</p>
                            <p className="text-sm text-gray-500">due:{task.dueDate}</p>
                            
                          </div>
                          Assigned To:
                            <select
          className="mt-2 p-1 border rounded"
          value={task.assignedTo || ""}
          onChange={(e) => handleAssignTask(task._id, e.target.value)}
        >
          <option value="">None</option>
          {project.team.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
                        </div>
                        
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
                <ProjectDiscussion projectId={id} />
                    )}
            {activeTab === 'files' && (
                <FileUploader projectId={id} />
                    )}
            
          </div>

          

          {/* Right Column - Team & Stats */}
          <div className="space-y-6">
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
                      {member.email.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="space-y-3">
                {project.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    </div>
                ))}
                </div> */}
            </div>

            
                <InviteTeamModal 
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        projectId={project._id}
        projectName={project.title}
        projectPriority={project.priority}
        projectDeadline={project.deadline}
      />

            {/* Project Stats */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Project Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full"  style={{ width: `${completedCount / tasks.length * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasks Completed</p>
                  <p className="text-lg font-medium">{completedCount}/{ tasks.length }</p>
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
      {showNewTaskModal && (
        <NewTaskModal
          onTaskClose={() => setShowNewTaskModal(false)}
          onTaskCreated={() => {
            console.log("TaskCreated");
            fetchProject();
            fetchTasks();
            setShowNewTaskModal(false);
          }}
          p = {project._id}
        />
      )}
    </div>
  );
};


const NewTaskModal = ({ onTaskClose, onTaskCreated,p }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    task: "",
    description: "",
    status: "in-progress",
    dueDate: "",
    priority: "Medium",
    assigned: "",
    p_id : p
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");
  
    try {
      const response = await axios.post("http://localhost:5000/task", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      console.log("API call success", response.data);
      onTaskCreated();
      console.log("onTaskCreated executed");
  
    } catch (err) {
      console.error("Error submitting task:", err.response ? err.response.data : err.message);
    }
  };
  

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Task Description"
            className="w-full border p-2 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ),
    },
    {
      title: "Task Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Deadline
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onTaskClose}
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
              Create Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;