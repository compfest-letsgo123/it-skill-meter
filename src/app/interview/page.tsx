"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabaseClient";
import Navbar from "@/components/Navbar";
import { CiSearch } from "react-icons/ci";

export default function Home() {
  const [warning, setWarning] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // New state for search input
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("roles_and_skills")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // Initialize arrays to hold categorized data
        const rolesArray: any[] = [];
        const skillsArray: any[] = [];

        // Categorize data based on 'type'
        data?.forEach((item) => {
          if (item.type === "role") {
            rolesArray.push(item);
          } else if (item.type === "skill") {
            skillsArray.push(item);
          }
        });

        setRoles(rolesArray);
        setSkills(skillsArray);
      }
    };

    fetchData();
  }, []);

  // Function to handle redirection on button click
  const handleRedirect = async (id: number) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      router.push(`/interview/${id}`);
    } else {
      setWarning("Please log in to access this feature.");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Show warning for 2 seconds before redirecting
    }
  };

  // Function to filter roles and skills based on search term
  const filteredRoles = roles.filter((role) =>
    role.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSkills = skills.filter((skill) =>
    skill.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8 min-h-screen">
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

      {/* Centered Search input for filtering roles and skills */}
      <div className="flex justify-center items-center mb-2">
  <CiSearch size={24} className="mr-[-35px] mt-[20px] top-1/2 transform -translate-y-1/2 text-gray-500" />
  <input
    type="text"
    name="Search"
    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-full text-lg hover:bg-gray-100 w-[600px] p-4 pl-10 placeholder-gray-500 focus:ring focus:ring-blue-300 transition-all duration-300"
    placeholder="Search for roles or skills..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>



      <div className="px-8 lg:px-16">
        {/* Conditionally render Role-based Section if there are matching roles */}
        {filteredRoles.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-black underline mb-4">
              Role-based
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {filteredRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRedirect(role.id)}
                  className="bg-white px-4 py-2 rounded-full text-black shadow hover:bg-gray-100"
                >
                  {role.nama}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Conditionally render Skill-based Section if there are matching skills */}
        {filteredSkills.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-black underline mb-4 pt-8">
              Skill-based
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleRedirect(skill.id)}
                  className="bg-white px-4 py-2 rounded-full text-black shadow hover:bg-gray-100"
                >
                  {skill.nama}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
