"use client"
// pages/interview.js

import React, { useState } from "react";
import InstructionCard from "@/components/InstructionCard";
import SelectionForm from "@/components/SelectionForm";
import DeviceTesting from "@/components/DeviceTesting";
import MainSession from "@/components/MainSession";
import LoadingScreen from "@/components/LoadingScreen";

export default function InterviewPage() {
  const [step, setStep] = useState(1);
  const [userSelection, setUserSelection] = useState({ language: "", duration: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueFromInstructions = () => {
    setStep(2);
  };

  const handleContinueFromSelection = (selection) => {
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

  const handleFinishInterview = () => {
    setIsLoading(true);
    // Simulate API call or processing time
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to results page or next step
      console.log("Interview finished, process results");
    }, 3000);
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