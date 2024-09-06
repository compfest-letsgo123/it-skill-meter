import { useState } from "react";

export default function Feedback() {
  const data = [
    {
      id: 1,
      question: "What is the capital of France?",
      feedback: "Good understanding, but remember to include more details.",
      answer: "The capital of France is Paris.",
      answerExample: "Example answer: Paris is the capital and most populous city of France."
    },
    {
      id: 2,
      question: "Explain the process of photosynthesis.",
      feedback: "Well explained, but include the chemical equation.",
      answer: "Photosynthesis is the process by which plants make their food.",
      answerExample: "Example answer: Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."
    }
  ];

  // State to manage the selected item and popup visibility
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    question: string;
    feedback: string;
    answer: string;
    answerExample: string;
  } | null>(null);

  // Function to open the popup with selected data
  const openPopup = (item: { id: number; question: string; feedback: string; answer: string; answerExample: string }) => {
    setSelectedItem(item);
  };

  // Function to close the popup
  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen">
      {/* Grid of feedback cards */}
      <div className="h-60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-md relative">
            <p className="text-gray-700 mb-2 font-bold">{item.question}</p>
            <p className="text-gray-500 text-sm mb-6">{item.feedback}</p>
            <div className="flex justify-center">
              <button
                className="bg-red-500 text-sm py-1 px-2 rounded-full absolute bottom-8"
                onClick={() => openPopup(item)}
              >
                Lihat feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              &times;
            </button>
            <h2 className="text-lg text-black font-bold mb-4">{selectedItem.question}</h2>
            <div className="mb-4">
              <h3 className="font-bold text-black text-sm mb-2">Answer:</h3>
              <p className="text-gray-700">{selectedItem.answer}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-black text-sm mb-2">Feedback:</h3>
              <p className="text-gray-700">{selectedItem.feedback}</p>
            </div>
            <div>
              <h3 className="font-bold text-black text-sm mb-2">Answer Example:</h3>
              <p className="text-gray-700">{selectedItem.answerExample}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
