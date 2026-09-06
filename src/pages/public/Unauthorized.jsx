import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-indigo-600">403</h1>
        <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-2">Access Denied</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          You don't have permission to view this page. Please log in with an appropriate account or return to the homepage.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
