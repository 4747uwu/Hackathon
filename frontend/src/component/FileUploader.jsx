import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, File, X, ExternalLink, Download } from "lucide-react";

const FileUploader = ({ projectId }) => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${projectId}/files`, {
        withCredentials: true,
      });
      console.log("Fetched files:", response.data);
      setFiles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/files/upload/${projectId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload success:", response.data);
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    // Assuming the file URL is available in the file object
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  // ✅ Update the file download handler
  const handleFileDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:5000/files/download/${projectId}/${fileId}`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileId); // Use file ID as filename (adjust as necessary)
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Project Files</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={48} className="text-gray-400 mb-4" />
            <span className="text-gray-600">
              Drag & drop files here or click to browse
            </span>
          </label>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>

        {file && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upload File
          </motion.button>
        )}
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-8"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <motion.div
                key={file._id}  // Use file._id for unique key
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between border border-gray-200 cursor-pointer group"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <File className="text-gray-400 flex-shrink-0" size={24} />
                  <span className="text-gray-700 truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDownload(file._id); // Pass file._id for the download
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Download file"
                  >
                    <Download size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileClick(file);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Open file"
                  >
                    <ExternalLink size={16} className="text-gray-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;
