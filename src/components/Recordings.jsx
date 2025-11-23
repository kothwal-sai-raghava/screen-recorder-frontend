import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";


export default function Recordings() {
  const [recordings, setRecordings] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recordings`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if (data.success) setRecordings(data.recordings);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch recordings");
      }
    };

    fetchRecordings();
  }, [location]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recordings/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRecordings((prev) => prev.filter((rec) => rec._id !== id));
        toast.success("Recording deleted");
      } else toast.error("Delete failed");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL recordings?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/recordings`, { 
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, });
      const data = await res.json();
      if (data.success) {
        setRecordings([]);
        toast.success(data.message);
      } else toast.error("Failed to delete all recordings");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="p-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Your Recordings</h2>

        {recordings.length > 0 && (
          <div className="flex justify-center md:justify-end mb-4">
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm md:text-base"
            >
              🗑 Delete All
            </button>
          </div>
        )}

        {recordings.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No recordings yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recordings.map((rec) => (
              <div
                key={rec._id}
                className="relative bg-white/10 p-3 rounded-lg shadow-md flex flex-col"
              >
                {/* Delete button top-right */}
                <button
                  onClick={() => handleDelete(rec._id)}
                  className="absolute top-2 right-2 p-1 bg-white/20 rounded-full hover:bg-red-200 transition z-10"
                  title="Delete recording"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>

                {/* Video */}
                <video
                  src={`http://localhost:5000/api/recordings/${rec._id}?token=${localStorage.getItem("token")}`}
                  controls
                  className="w-full rounded-lg max-h-[250px] sm:max-h-[300px] md:max-h-[250px] lg:max-h-[200px] object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
