"use client";
import { useState, useRef, useEffect } from "react";

export default function InterviewPrep({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const microphoneSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const testSpeaker = () => {
    if (isPlayingAudio) {
      // Stop speaker test
      setIsPlayingAudio(false);
      if (testAudio) {
        testAudio.pause();
        testAudio.currentTime = 0; // Reset audio to the beginning
      }
    } else {
      // Start speaker test
      setIsPlayingAudio(true);
      const audio = new Audio("/audio/test_speaker.m4a");
      setTestAudio(audio);
      audio.play();
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  const testMicrophone = async () => {
    if (isMicTesting) {
      // Stop mic test
      setIsMicTesting(false);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // Start mic test
      setIsMicTesting(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setMediaStream(stream);

          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const microphoneSource =
            audioContext.createMediaStreamSource(stream);
          const destination = audioContext.createMediaStreamDestination();

          microphoneSource.connect(destination);
          destination.stream.getAudioTracks().forEach((track) => {
            stream.addTrack(track);
          });

          // Introduce a 5-second delay before starting loopback
          timeoutRef.current = setTimeout(() => {
            microphoneSource.connect(audioContext.destination);
          }, 5000);

          audioContextRef.current = audioContext;
          microphoneSourceRef.current = microphoneSource;
          destinationRef.current = destination;
        } catch (error) {
          console.error("Error accessing the microphone", error);
          setIsMicTesting(false);
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-black">
        Apakah kamu siap untuk memulai interview?
      </h2>

      <div className="flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          className="flex justify-center w-200px max-w-sm mb-4 rounded-xl"
        />
      </div>

      <div className="flex justify-center space-x-8 mb-6">
        <button
          onClick={testMicrophone}
          className={`flex flex-col items-center ${
            isMicTesting ? "text-red-600" : "text-gray-600"
          }`}
        >
          <div
            className={`w-12 h-12 ${
              isMicTesting ? "bg-red-200" : "bg-gray-200"
            } rounded-full flex items-center justify-center mb-2`}
          >
            <svg
              className="w-6 h-6"
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
          <span className="text-sm">
            {isMicTesting ? "Stop" : "Tes mikrofon"}
          </span>
        </button>

        <button
          onClick={testSpeaker}
          className={`flex flex-col items-center ${
            isPlayingAudio ? "text-red-600" : "text-gray-600"
          }`}
        >
          <div
            className={`w-12 h-12 ${
              isPlayingAudio ? "bg-red-200" : "bg-gray-200"
            } rounded-full flex items-center justify-center mb-2`}
          >
            <svg
              className="w-6 h-6"
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
          <span className="text-sm">
            {isPlayingAudio ? "Stop" : "Tes Speaker"}
          </span>
        </button>
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="border-t-2 border-gray-400 mt-4 px-2"></div>

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