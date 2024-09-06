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
    const BASE_URL = 'http://34.142.176.135';
    const PATH_URL = '/predict';
    console.log(BASE_URL + PATH_URL);
    try {
      const response = await axios.get(BASE_URL + PATH_URL, {
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
    const requestBody = await handleQueryRAG(
      `You are currently interviewing the user, and the interview will consist of ${userSelection.numQuestions} questions. Can you start the interview? You may begin by asking any question related to the role the user has applied for. Return a query with only one key: 'question', and set the value using ${userSelection.language}`
    );

    // RESPONSE PERTANYAAN
    setCurrentPertanyaan(requestBody.data.question);
    setIsLoading(false);
  };

  const handleContinueInterview = (text: string) => {
    setIsLoading(true);
    console.log(text);

    // Store the current question and answer
    setDaftarPertanyaan((prevQuestions) => [...prevQuestions, currentPertanyaan]);
    setDaftarJawaban((prevAnswers) => [...prevAnswers, text]);

    // Clear the current answer for the next question
    setCurrentAnswer('');

    setMainSessionCount((prevCount) => prevCount + 1);
    const numQuestions = parseInt(userSelection.numQuestions) || 0;

    // Simulate API call
    setTimeout(() => {
      if (mainSessionCount !== numQuestions) {
        // API PERTANYAAN SELANJUTNYA
        const pertanyaanSelanjutnya = 'Siapakah penemu Google?';

        setIsLoading(false);

        setCurrentPertanyaan(pertanyaanSelanjutnya);
      } else {
        // API MEMANGGIL REKAP
        const requestBodyAI = 'SOK APA BAE';

        // API MENYIMPAN KE DATABASE
        // 1. Menyimpan seluruh daftar pertanyaan dan daftar jawaban
        const requestBodyQnA = daftarPertanyaan.map((pertanyaan, index) => ({
          id: index + 1, // Replace with actual ID generation logic if needed
          pertanyaan,
          jawaban: daftarJawaban[index],
        }));

        // 2. Menyimpan seluruh hasil
        const level = 'Novice';
        const overview = 'Overview Example';
        const evaluation = [
          {
            score: 78,
            title: 'Pemahaman dan Pengetahuan Teknis',
            title_id: 1,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
          {
            score: 78,
            title: 'Penggunaan Waktu',
            title_id: 2,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
          {
            score: 78,
            title: 'Pemecahan Masalah',
            title_id: 3,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
          {
            score: 78,
            title: 'Kreativitas dan Inovasi',
            title_id: 4,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
          {
            score: 78,
            title: 'Keterampilan Komunikasi',
            title_id: 5,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
          {
            score: 78,
            title: 'Kepercayaan Diri dan Sikap',
            title_id: 6,
            deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          },
        ];

        const requestBodySimpanHasil = { id, level, overview, evaluation };

        console.log(requestBodyQnA);
        console.log(requestBodySimpanHasil);

        const hasil_id = 3; // This should be replaced with the actual query result
        // router.push(`/rekap-hasil/${hasil_id}`);
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
