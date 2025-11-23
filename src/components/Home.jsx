import { Monitor, Play, List, Pause, Square, StopCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const streamRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);


  const showRecordings = () => navigate("/recordings", { state: { refresh: true } });

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording,isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: "video/webm" });
        await uploadVideo(file);
        navigate("/recordings", { replace: true });
      };

      recorder.start();
setMediaRecorder(recorder);
setSeconds(0);
setIsRecording(true);
setIsPaused(false);

    } catch (err) {
      console.log(err.message);
      toast.error("Failed to start recording");
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorder) return;

  if (!isPaused) {
    mediaRecorder.pause();
    setIsPaused(true);
  } else {
    mediaRecorder.resume();
    setIsPaused(false);
  }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

  mediaRecorder.stop();
  streamRef.current?.getTracks().forEach(track => track.stop());
  setIsRecording(false);
  setIsPaused(false);
  };

  const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    chunksRef.current = [];

    try {
      const res = await fetch(`http://localhost:5000/api/recordings`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) toast.success("Recording saved!");
      else toast.error("Upload failed");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-0">
      <Navbar />

      <div className="w-full flex justify-center items-center p-4">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <Monitor className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-semibold mb-2">Screen Recorder</h1>
            <p className="text-muted-foreground text-lg">
              Professional screen recording for presentations, tutorials, and more
            </p>
          </div>

          {/* Recording Controls */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 justify-center place-items-center">
            {!isRecording ? (
              <div
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/10 p-6 rounded-xl w-full sm:max-w-xs md:max-w-sm"
                onClick={startRecording}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold">Start Recording</h3>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/10 p-6 rounded-xl w-full sm:max-w-xs md:max-w-sm"
                onClick={stopRecording}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <StopCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold">Stop Recording</h3>
                </div>
              </div>
            )}

            <div
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/10 p-6 rounded-xl w-full sm:max-w-xs md:max-w-sm"
              onClick={showRecordings}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <List className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold">Show Recordings</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Timer & Controls */}
      {isRecording && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-xl flex items-center gap-4 shadow-lg text-sm sm:text-base">
          <span className="font-semibold">
            ⏱ {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
          <button onClick={pauseRecording} className="hover:scale-110 transition">
  {isPaused ? (
    <Play className="h-5 w-5 text-green-400" />
  ) : (
    <Pause className="h-5 w-5 text-yellow-400" />
  )}
</button>

          <button onClick={stopRecording} className="hover:scale-110 transition">
            <Square className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
