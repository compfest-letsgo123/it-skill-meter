import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MainSession({ onContinue }: { onContinue: (text: string) => void; }) {
  const [liveText, setLiveText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleStartRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // onFinish(liveText); // Pass liveText to parent when recording stops
    }
  };

  const handleSubmit = () => {
    onContinue(liveText);
  }

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

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID'; // Set language to Indonesian
      recognition.interimResults = true; // Enable interim results
      recognition.continuous = true; // Keep listening

      let interimTranscript = '';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript = event.results[i][0].transcript;
          }
        }
        setLiveText((prevText) => prevText + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error("SpeechRecognition error", event.error);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      {/* Back Button and Question Header */}
      <div className="flex justify-between items-center mb-4 text-black">
        <div>Pertanyaan 1</div>
        <button
          onClick={handleBack}
          className="border border-gray-400 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
        >
          Keluar
        </button>
      </div>

      <div className="border-t-2 border-gray-400 mt-2 px-2 pb-4"></div>

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
          <div className="flex justify-center">
            <button 
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className="bg-primary-red rounded-md h-8 px-4 flex justify-center items-center text-sm hover:secondary-red"
            >
              {isRecording ? 'Stop Rekam Jawaban' : 'Mulai Rekam Jawaban'}
            </button>
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
        <button onClick={handleSubmit} className="px-6 py-2 bg-red-500 text-white rounded">
          Lanjut
        </button>
      </div>
    </div>
  );
}
