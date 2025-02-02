import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";

const MilestoneTracker = ({ projectId }) => {
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const res = await axios.get(`http://localhost:5000/milestone/${projectId}`, { withCredentials: true });
      setMilestones(res.data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
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
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Milestone Progress</h2>

      {/* Progress Bar with Hover Names */}
      <motion.div
        className="relative w-full h-8 bg-gray-200 rounded-full group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
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
      </motion.div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center mt-6">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      ) : (
        <>
          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <motion.button
              onClick={completeMilestone}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Check size={18} /> Complete Next
            </motion.button>
            <motion.button
              onClick={removeMilestone}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Trash2 size={18} /> Remove
            </motion.button>
            <motion.button
              onClick={generateMilestones}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              Generate
            </motion.button>
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
            <motion.button
              onClick={addMilestone}
              className="text-blue-600 hover:text-blue-800 transition"
              whileTap={{ scale: 0.9 }}
            >
              <PlusCircle size={26} />
            </motion.button>
          </div>

          {/* List of Milestones */}
          <div className="mt-6">
            {milestones.length === 0 ? (
              <p className="text-gray-500">No milestones yet.</p>
            ) : (
              milestones.map((milestone) => (
                <motion.div
                  key={milestone._id}
                  className={`p-2 rounded-md border mb-2 flex items-center justify-between ${
                    milestone.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-sm">{milestone.title}</span>
                  {milestone.completed ? (
                    <span className="text-xs text-green-500">Completed</span>
                  ) : (
                    <motion.button
                      onClick={() => completeMilestone(milestone._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      Complete
                    </motion.button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MilestoneTracker;
