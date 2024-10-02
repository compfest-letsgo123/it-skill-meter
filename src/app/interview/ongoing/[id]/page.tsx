'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseClient';
import { roadmapReference } from '@/data/roadmaps';
import InstructionCard from '@/components/InstructionCard';
import SelectionForm from '@/components/SelectionForm';
import DeviceTesting from '@/components/DeviceTesting';
import MainSession from '@/components/MainSession';
import LoadingScreen from '@/components/LoadingScreen';
import axios from 'axios';

export default function InterviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [step, setStep] = useState(1);
  const [path, setPath] = useState<any>(null);
  const [roadmap, setRoadmap] = useState({});
  const [userSelection, setUserSelection] = useState({ language: '', numQuestions: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mainSessionCount, setMainSessionCount] = useState(1);
  const [currentPertanyaan, setCurrentPertanyaan] = useState('');
  const [daftarPertanyaan, setDaftarPertanyaan] = useState<Array<string>>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [daftarJawaban, setDaftarJawaban] = useState<Array<string>>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: rolesAndSkills, error } = await supabase
        .from('roles_and_skills')
        .select('id, nama')
        .eq('id', parseInt(id as string));

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // console.log("Fetched data:", rolesAndSkills); // Log the fetched data
        setPath(rolesAndSkills[0]); // Assuming you want the first matching item
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (path?.nama) {
      // Assuming `roadmapReference` is your JSON object containing the roadmap
      const relatedRoadmap = roadmapReference[path.nama as keyof typeof roadmapReference];
      if (relatedRoadmap) {
        setRoadmap(relatedRoadmap);
      } else {
        console.error('No roadmap found for the given path:', path.nama);
      }
    }
  }, [path, roadmap]);

  const handleQueryRAG = async (query: string) => {
    const PATH_URL = '/predict';
    console.log(process.env.NEXT_PUBLIC_RAG_BASE_URL + PATH_URL);
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_RAG_BASE_URL + PATH_URL, {
        params: {
          lang: userSelection.language == 'Bahasa Indonesia' ? 'id' : 'en',
          role: path.nama,
          query,
        },
        timeout: 86400000, // 1 day in milliseconds
      });
      console.log('Response', response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };

  const handleContinueFromInstructions = () => {
    setStep(2);
  };

  const handleContinueFromSelection = (selection: { language: string; numQuestions: string }) => {
    setUserSelection(selection);
    setStep(3);
  };

  const handleBackToInstructions = () => {
    setStep(1);
  };

  const handleBackToSelection = () => {
    setStep(2);
  };

  const handleStartInterview = async () => {
    setIsLoading(true);
    setStep(4);

    // CALL API PERTAMA
    const response = await handleQueryRAG(
      `You are currently interviewing the user, and the interview will consist of ${userSelection.numQuestions} questions. Can you start the interview? You may begin by asking any question related to the role the user has applied for. Return a query with only one key: 'question', and set the value using ${userSelection.language}`
    );

    // RESPONSE PERTANYAAN
    setCurrentPertanyaan(response.data.question);
    // setCurrentPertanyaan("Apa yang kamu ketahui tentang Frontend Beginner?");
    setIsLoading(false);
  };

  const handleContinueInterview = (text: string) => {
    // Store the current question and answer
    let newDaftarPertanyaan = [...daftarPertanyaan, currentPertanyaan];
    let newDaftarJawaban = [...daftarJawaban, text];
    setDaftarPertanyaan(newDaftarPertanyaan);
    setDaftarJawaban(newDaftarJawaban);

    let result =
      "Here is the interview conversation between you and the user. 'Q' represents you, and 'A' represents the user.\n\n";

    for (let i = 0; i < newDaftarPertanyaan.length; i++) {
      result += `Q${i + 1}: ${newDaftarPertanyaan[i]}\nA${i + 1}: ${newDaftarJawaban[i]}\n\n`;
    }
    result += '\n\n';

    console.log('result', result);
    setIsLoading(true);

    // Clear the current answer for the next question
    setCurrentAnswer('');

    setMainSessionCount((prevCount) => prevCount + 1);
    const numQuestions = parseInt(userSelection.numQuestions) || 0;

    // Simulate API call
    setTimeout(async () => {
      console.log(mainSessionCount, numQuestions);
      if (mainSessionCount < numQuestions) {
        // CALL API PERTANYAAN SELANJUTNYA
        console.log(result);
        const response = await handleQueryRAG(
          `${result}. You can continue from where you or the user left off. Return a query with only one key: 'question', and set the value using ${userSelection.language}`
        );

        setIsLoading(false);

        // RESPONSE PERTANYAAN
        setCurrentPertanyaan(response.data.question);
      } else {
        // API MEMANGGIL REKAP
        const response = await handleQueryRAG(
          `${result}Try providing the level, overview, evaluation, and feedback from the interview result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "level": {
      "type": "string",
      "enum": ["Intern", "Junior", "Associate", "Senior", "Lead"]
    },
    "overview": {
      "type": "string"
    },
    "evaluation": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "score": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        },
        "required": ["score", "title", "description"]
      }
    },
    "feedback": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "skill": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "link": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uri"
            }
          }
        },
        "required": ["type", "description", "link"]
      }
    }
  },
  "required": ["level", "overview", "evaluation", "feedback"]
}`
        );
        const { level, overview, evaluation, feedback } = response.data;

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const { data, error }: { data: any; error: any } = await supabase
          .from('hasil')
          .insert({
            created_at: new Date().toISOString(),
            id_roles_and_skills: parseInt(id),
            level,
            overview,
            evaluation,
            id_user: session?.user.id, // Replace with actual roadmap ID if available
            feedback,
          })
          .select();

        if (error) {
          console.error('Error inserting data into Supabase:', error);
        } else {
          console.log('Data successfully inserted into Supabase:', data);
          router.push(`/rekap-hasil/${data[0].id}`);
        }

        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
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
              key={currentPertanyaan}
              onContinue={handleContinueInterview}
              currentPertanyaan={currentPertanyaan}
              currentMainSessionCount={mainSessionCount}
              userSelectionLanguage={userSelection.language}
              currentAnswer={currentAnswer}
              setCurrentAnswer={setCurrentAnswer}
            />
          )}
        </>
      )}
    </div>
  );
}
