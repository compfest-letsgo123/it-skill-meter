import React from 'react';

interface FeedbackItem {
  skill: string;
  description: string;
  link: string[];
}

export default function Feedback({ data }: { data: FeedbackItem[] }) {
  return (
    <div className="min-h-screen py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gray-50 border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  {item.skill}
                </h2>
                <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 rounded-full">#{index + 1}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4 text-md">{item.description}</p>
              {item.link.length > 0 && (
                <div className="mt-4 text-sm">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    Resources:
                  </h3>
                  <ul className="space-y-1">
                    {item.link.map((resource, idx) => (
                      <li key={idx}>
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}