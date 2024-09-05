"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InstructionCard from "@/components/InstructionCard";
import SelectionForm from "@/components/SelectionForm";
import DeviceTesting from "@/components/DeviceTesting";
import MainSession from "@/components/MainSession";
import LoadingScreen from "@/components/LoadingScreen";

export default function InterviewPage() {
  const [step, setStep] = useState(1);
  const [userSelection, setUserSelection] = useState({ language: "", numQuestions: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [mainSessionCount, setMainSessionCount] = useState(1);
  const [liveText, setLiveText] = useState("");
  const [daftarPertanyaanJawaban, setDaftarPertanyaanJawaban] = useState({});
  // const []
  const router = useRouter();

  const handleContinueFromInstructions = () => {
    setStep(2);
  };

  const handleContinueFromSelection = (selection: { language: string, numQuestions: string }) => {
    setUserSelection(selection);
    setStep(3);
  };

  const handleBackToInstructions = () => {
    setStep(1);
  };

  const handleBackToSelection = () => {
    setStep(2);
  };

  const handleStartInterview = () => {
    setStep(4);
  };

  const handleFinishInterview = (text: string) => {
    setIsLoading(true);
    setLiveText(text); // Set the live text when the interview is finished

    // CALL API DI SINI
    setTimeout(() => {
      setIsLoading(false);
      console.log("Interview finished, process results", text); // Log live text
    }, 3000);

    setMainSessionCount(mainSessionCount + 1);
    console.log(mainSessionCount);
    setLiveText(text)
    const numQuestions = parseInt(userSelection.numQuestions) || 0;
    if (mainSessionCount === numQuestions) {
      router.push(`/rekap-hasil/3`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {step === 1 && <InstructionCard onContinue={handleContinueFromInstructions} />}
          {step === 2 && (
            <SelectionForm
              onContinue={handleContinueFromSelection}
              onBack={handleBackToInstructions}
            />
          )}
          {step === 3 && (
            <DeviceTesting
              onBack={handleBackToSelection}
              onContinue={handleStartInterview}
            />
          )}
          {step === 4 && (
            <MainSession
              onContinue={handleFinishInterview}
            />
          )}
        </>
      )}
    </div>
  );
}
