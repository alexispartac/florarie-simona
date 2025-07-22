'use client';
import Link from 'next/link';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center m-2 h-screen bg-white">
            <h1 className="flex text-center text-4xl font-bold  text-gray-800">Pagina nu a fost găsită</h1>
            <p className="flex text-center text-lg text-gray-600 mt-4">
                Ne pare rău, dar pagina pe care o cauți nu există.
            </p>
            <button className="mt-6 px-6 py-3 bg-[#b756a64f] text-white rounded-md">
                <Link href="/">
                    Înapoi la pagina principală
                </Link>
            </button>
        </div>
    );
};

export default NotFound;