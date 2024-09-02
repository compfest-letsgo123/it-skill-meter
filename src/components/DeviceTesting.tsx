"use client";
import { useState, useRef, useEffect } from "react";
import Garis from "./Garis";

export default function InterviewPrep({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  //   const startMicTest = () => {
  //     setIsMicTesting(true);
  //     navigator.mediaDevices.getUserMedia({ audio: true })
  //       .then(stream => {
  //         mediaRecorderRef.current = new MediaRecorder(stream);
  //         mediaRecorderRef.current.ondataavailable = event => {
  //           audioChunksRef.current.push(event.data);
  //         };
  //         mediaRecorderRef.current.onstop = () => {
  //           const audioBlob = new Blob(audioChunksRef.current);
  //           const audioUrl = URL.createObjectURL(audioBlob);
  //           audioRef.current.src = audioUrl;
  //           audioRef.current.play();
  //         };
  //         mediaRecorderRef.current.start();
  //         setTimeout(() => {
  //           mediaRecorderRef.current.stop();
  //           setIsMicTesting(false);
  //         }, 5000);
  //       });
  //   };

  const testSpeaker = () => {
    setIsPlayingAudio(true);
    // Replace with actual audio file path
    const audio = new Audio("/path-to-test-audio.mp3");
    audio.play();
    audio.onended = () => setIsPlayingAudio(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-black">
        Apakah kamu siap untuk memulai interview?
      </h2>

    <div className="flex justify-center">
        <video ref={videoRef} autoPlay className="flex justify-center w-200px max-w-sm mb-4 rounded-xl" />
    </div>
      

      <div className="flex justify-center space-x-8 mb-6">
        <button
          //   onClick={startMicTest}
          disabled={isMicTesting}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Tes mikrofon</span>
        </button>

        <button
          onClick={testSpeaker}
          disabled={isPlayingAudio}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Tes Speaker</span>
        </button>
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className=" border-t-2 border-gray-400 mt-4 px-2"></div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
        <button
          onClick={onContinue}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
