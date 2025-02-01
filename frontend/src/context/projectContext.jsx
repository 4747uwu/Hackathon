import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Create Project Context
const ProjectContext = createContext();

// Project Provider Component
export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects for the logged-in user
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/project", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setProjects(response.data);
      console.log(projects);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            credentials : "include"
          },
          withCredentials:true
        },
      );
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  };

  // Update an existing project
  const updateProject = async (projectId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/project/${projectId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProjects(
        projects.map((proj) => (proj._id === projectId ? response.data : proj))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        loading, 
        error, 
        fetchProjects, 
        createProject, 
        updateProject 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Custom Hook to use ProjectContext
export const useProjects = () => useContext(ProjectContext);