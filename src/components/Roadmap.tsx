interface RoadmapProps {
  nama: string;
}

export default function Roadmap({ nama }: RoadmapProps) {
  const roadmapSvgPath = `/roadmaps/${nama}.svg`;

  return (
    <>
      <div className="w-full space-y-8">
        {/* Roadmap Section */}
        <div className="bg-white p-6 rounded-xl shadow-md max-h-[90vh] overflow-auto ">
          <h3 className="text-xl font-bold mb-4 text-black">Roadmap 🗺️</h3>
          <div className="flex justify-center">
            <div className="w-full">
              <img
                src={roadmapSvgPath}
                alt={`Roadmap for ${nama}`}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
