'use client';
import Link from 'next/link';

export default function TooManyRequests() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100">
        <div className="text-6xl mb-6 text-yellow-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <p className="text-3xl font-bold text-text-light mb-3">
          Ai depasit limita de cereri
        </p>
        <p className="text-gray-600 mb-8">
          Ai făcut prea multe cereri într-un perioadă scurtă de timp. 
          Te rog așteaptați câteva minute înainte de a încerca din nou.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
