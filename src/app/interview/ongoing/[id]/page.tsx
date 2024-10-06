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
  const [sidewaysLookCounter, setSidewaysLookCounter] = useState<number>(0);
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
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + PATH_URL, {
        params: {
          lang: userSelection.language == 'Bahasa Indonesia' ? 'id' : 'en',
          role: path.nama,
          query,
        },
        timeout: 86400000, // 1 day in milliseconds
      });
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

    setIsLoading(true);

    // Clear the current answer for the next question
    setCurrentAnswer('');

    setMainSessionCount((prevCount) => prevCount + 1);
    const numQuestions = parseInt(userSelection.numQuestions) || 0;

    // Simulate API call
    setTimeout(async () => {
      if (mainSessionCount < numQuestions) {
        // CALL API PERTANYAAN SELANJUTNYA
        const response = await handleQueryRAG(
          `${result}. You can continue from where you or the user left off. Make sure that you ask a question that never asked before. Return a query with only one key: 'question', and set the value using ${userSelection.language}`
        );

        setIsLoading(false);

        // RESPONSE PERTANYAAN
        setCurrentPertanyaan(response.data.question);
      } else {
        // API MEMANGGIL REKAP
        const response_1 = await handleQueryRAG(
          `${result}. Give me the level and overview from the interview result using the following JSON schema:

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
    }
  },
  "required": ["level", "overview"]
}.

Make sure that you write a long 'overview'. Don't make up anything outside of the interview conversation result.`
        );

        const response_2 = await handleQueryRAG(
          `${result}. Give me the feedback from the interview result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
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
  "required": ["feedback"]
}.`
        );

        const response_3 = await handleQueryRAG(
          `${result}. Give me the evaluation of "Pemahaman dan Pengetahuan Teknis" from the interview conversation result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "title": {
      "type": "string",
      "const": "Pemahaman dan Pengetahuan Teknis"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["score", "title", "description"]
}.

Make sure that you write a long enough 'description' and make sure the score base on answer. Don't make up anything outside of the interview conversation result.`
        );

        const response_4 = await handleQueryRAG(
          `${result}. Give me the evaluation of "Kreativitas dan Inovasi" from the interview conversation result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "title": {
      "type": "string",
      "const": "Kreativitas dan Inovasi"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["score", "title", "description"]
}.

Make sure that you write a long enough 'description' and make sure the score base on answer. Don't make up anything outside of the interview conversation result.`
        );

        const response_5 = await handleQueryRAG(
          `${result}. Give me the evaluation of "Keterampilan Komunikasi" from the interview conversation result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "title": {
      "type": "string",
      "const": "Keterampilan Komunikasi"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["score", "title", "description"]
}.

Make sure that you write a long enough 'description' and make sure the score base on answer. Don't make up anything outside of the interview conversation result.`
        );

        const response_6 = await handleQueryRAG(
          `${result}. Give me the evaluation of "Pemecahan Masalah" from the interview conversation result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "title": {
      "type": "string",
      "const": "Pemecahan Masalah"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["score", "title", "description"]
}.

Make sure that you write a long enough 'description' and make sure the score base on answer. Don't make up anything outside of the interview conversation result.`
        );

        const response_7 = await handleQueryRAG(
          `${result}. Give me the evaluation of "Kepercayaan Diri dan Sikap" from the interview conversation result using the following JSON schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "title": {
      "type": "string",
      "const": "Kepercayaan Diri dan Sikap"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["score", "title", "description"]
}.

Make sure that you write a long enough 'description' and and make sure the score base on answer and Note that the user has looked sideways ${sidewaysLookCounter} times. A higher frequency of sideways glances may indicate that the user is not speaking fluently or confidently.`
        );

        const { level, overview } = response_1.data;
        const { feedback } = response_2.data;
        const evaluation_1 = response_3.data;
        const evaluation_2 = response_4.data;
        const evaluation_3 = response_5.data;
        const evaluation_4 = response_6.data;
        const evaluation_5 = response_7.data;
        const evaluation = [evaluation_1, evaluation_2, evaluation_3, evaluation_4, evaluation_5];

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
          router.push(`/rekap-hasil/${data[0].id}`);
        }

        // RESPONSE PERTANYAAN
        setCurrentPertanyaan('');
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
              setSidewaysLookCounter={setSidewaysLookCounter}
            />
          )}
        </>
      )}
    </div>
  );
}
