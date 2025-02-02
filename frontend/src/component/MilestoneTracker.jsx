import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Check } from "lucide-react";

const MilestoneTracker = ({ projectId }) => {
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    if (projectId) fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/milestone/${projectId}`, { withCredentials: true });
      setMilestones(res.data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const addMilestone = async () => {
    if (!newMilestone.trim()) return;
    try {
      await axios.post(`http://localhost:5000/milestone/${projectId}`, { title: newMilestone }, { withCredentials: true });
      setNewMilestone("");
      fetchMilestones();
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  const removeMilestone = async () => {
    if (milestones.length === 0) return;
    try {
      await axios.delete(`http://localhost:5000/milestone/${projectId}`, { withCredentials: true });
      fetchMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const completeMilestone = async () => {
    const uncompletedMilestone = milestones.find((m) => !m.completed);
    if (!uncompletedMilestone) return;
    try {
      await axios.put(`http://localhost:5000/milestone/${projectId}`, {}, { withCredentials: true });
      fetchMilestones();
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };
  const generateMilestones = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/milestone/generate/${projectId}`, {}, { withCredentials: true });
      fetchMilestones(projectId, setMilestones);
    } catch (error) {
      console.error("Error generating milestones with AI:", error);
    }
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Milestone Progress</h2>

      {/* Progress Bar with Hover Names */}
      <div className="relative w-full h-8 bg-gray-200 rounded-full group">
        <div
          className="absolute h-8 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
        <div className="absolute w-full h-full flex justify-between items-center px-2 text-xs text-gray-700">
          {milestones.map((m, index) => (
            <div key={m._id} className="relative">
              <div className={`w-3 h-3 rounded-full ${m.completed ? "bg-green-600" : "bg-gray-500"}`}></div>
              <span
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button onClick={completeMilestone} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Check size={18} /> Complete Next
        </button>
        <button onClick={removeMilestone} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
          <Trash2 size={18} /> Remove
        </button>
        <button onClick={generateMilestones} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
          Generate
        </button>
      </div>

      {/* Add Milestone */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="New milestone..."
          className="border p-2 rounded flex-1 focus:ring focus:ring-blue-300"
        />
        <button onClick={addMilestone} className="text-blue-600 hover:text-blue-800 transition">
          <PlusCircle size={26} />
        </button>
      </div>
    </div>
  );
};

export default MilestoneTracker;
