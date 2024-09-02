import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InterviewSession({onContinue} : {onContinue: () => void;}) {
  const initialTime = 120; // 2 minutes in seconds
  const [time, setTime] = useState(initialTime);
  const [liveText, setLiveText] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing the webcam", err));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    return (time / initialTime) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-4xl mx-auto">

      {/* Timer, Back Button and Question Header */}
      <div className="flex justify-between items-center mb-4 text-black">
        <div>Pertanyaan 1</div>
        <div className="text-2xl font-bold">{formatTime(time)}</div>
        <button
          onClick={handleBack}
          className="border border-gray-400 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
        >
          Keluar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="bg-primary-red h-full transition-all duration-1000 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>

      {/* Interviewer and User Headers */}
      <div className="flex flex-row gap-x-16 justify-between">
        <div className="w-1/2">
          <h3 className="flex justify-center mb-2 font-semibold text-black">
            Virtual Interviewer
          </h3>
        </div>
        <div className="w-1/2">
          <h3 className="flex justify-center mb-2 font-semibold text-black">
            User
          </h3>
        </div>
      </div>

      {/* Interview Session */}
      <div className="grid grid-cols-2 gap-16 mb-4">
        <div className="flex flex-col justify-center items-center">
          <div className="h-32 flex items-center justify-center mb-2">
            <Image
              src="/icons/virtual-interviewer.svg"
              alt="virtual interviewer"
              width={80}
              height={80}
            />
          </div>
          <div className="flex justify-center">
            <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
              Ulangi Pertanyaan
            </button>
          </div>
        </div>
        <div>
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-48 bg-gray-200 mb-2 rounded-xl"
          />
          <div className="bg-red-100 h-8">
            {/* User audio waveform would go here */}
          </div>
        </div>
      </div>

      {/* Live Text Display */}
      <div className="mb-4">
        <h3 className="mb-2">Live Text</h3>
        <div className="border p-2 h-32 text-sm overflow-y-auto text-gray-600">
          {liveText || "Transcribed text will appear here..."}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button onClick={onContinue} className="px-6 py-2 bg-red-500 text-white rounded">
          Lanjut
        </button>
      </div>
    </div>
  );
}
