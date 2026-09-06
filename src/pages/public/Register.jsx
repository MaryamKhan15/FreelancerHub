import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('freelancer'); // default role
  const [skills, setSkills] = useState('');
  const [expertise, setExpertise] = useState('Beginner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Prepare user document data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        profilePic: ''
      };

      // If freelancer, append specific fields
      if (role === 'freelancer') {
        userData.skills = skills.split(',').map(s => s.trim()).filter(s => s);
        userData.expertise = expertise;
      }

      // 3. Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register account');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Log in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1 transition-all"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1 transition-all"
                placeholder="••••••••"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">I want to:</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer p-3 border border-slate-200 rounded-lg flex-1 hover:border-indigo-300 transition-colors">
                  <input
                    type="radio"
                    value="freelancer"
                    checked={role === 'freelancer'}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700">Work as Freelancer</span>
                </label>
                <label className="flex items-center cursor-pointer p-3 border border-slate-200 rounded-lg flex-1 hover:border-indigo-300 transition-colors">
                  <input
                    type="radio"
                    value="client"
                    checked={role === 'client'}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700">Hire for Project</span>
                </label>
              </div>
            </div>

            {/* Freelancer Specific Fields */}
            {role === 'freelancer' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Your Skills</label>
                  <input
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1 transition-all"
                    placeholder="React, Node.js, Design (comma separated)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700">Expertise Level</label>
                  <select
                    className="relative block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1 bg-white transition-all"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
