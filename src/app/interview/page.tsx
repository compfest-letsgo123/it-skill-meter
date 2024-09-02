"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabaseClient"; // Adjust the path according to your project structure
import { roles, skills } from "@/data/rolesAndSkills";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [warning, setWarning] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle redirection on button click
  const handleRedirect = async (id: number) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      router.push(`/interview/${id}`);
    } else {
      setWarning("Please log in to access this feature.");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Show warning for 2 seconds before redirecting
    }
  };

  return (
    <div className="pb-8">
      <Navbar />
      <h1 className="flex justify-center text-4xl font-bold mb-8 pt-32 text-black">
        Pilih Karir IT Ambisimu!
      </h1>

      {/* Display warning message if needed */}
      {warning && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center p-4 z-50">
          {warning}
        </div>
      )}

      {/* Role-based Section */}
      <div className="px-8 lg:px-16">
        <h2 className="text-2xl font-bold text-black underline mb-4">Role-based</h2>
        <div className="grid grid-cols-4 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRedirect(role.id)}
              className="bg-white px-4 py-2 rounded-full text-black shadow hover:bg-gray-100"
            >
              {role.nama}
            </button>
          ))}
        </div>
        {/* Skill-based Section */}
        <h2 className="text-2xl font-bold text-black underline mb-4 pt-8">Skill-based</h2>
        <div className="grid grid-cols-4 gap-4">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleRedirect(skill.id)}
              className="bg-white px-4 py-2 rounded-full text-black shadow hover:bg-gray-100"
            >
              {skill.nama}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}