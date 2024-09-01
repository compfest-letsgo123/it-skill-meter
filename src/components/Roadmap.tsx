export default function Roadmap() {
    return (
      <div className="min-h-screen">
        <div className="w-full space-y-8">
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white h-72 p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">😊</div>
                <h2 className="text-xl font-bold text-black">Sudah baik</h2>
              </div>
              <p className="text-gray-600 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer auctor sed quam ut mattis...
              </p>
            </div>
  
            {/* Card 2 */}
            <div className="bg-white h-72 p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">☹️</div>
                <h2 className="text-xl font-bold text-black">Tingkatkan & perbaiki</h2>
              </div>
              <p className="text-gray-600 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer auctor sed quam ut mattis...
              </p>
            </div>
          </div>
  
          {/* Roadmap Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-black">Roadmap 🗺️</h3>
            <div className="flex justify-center">
              <div className="w-full text-gray-500">
                Isi hasil svg roadmapnya di sini
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  