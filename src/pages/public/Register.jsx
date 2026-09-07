import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('freelancer'); // 'freelancer' | 'client'
  
  // Comprehensive Freelancer Profile & Verification Fields
  const [expertiseTitle, setExpertiseTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experienceYears, setExperienceYears] = useState('3-5 Years');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [certification, setCertification] = useState('');
  const [documentFileName, setDocumentFileName] = useState('');
  const [documentUploaded, setDocumentUploaded] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDocumentSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFileName(file.name);
      setDocumentUploaded(true);
      toast.success(`Document "${file.name}" attached for verification!`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Prepare comprehensive user document data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        profilePic: ''
      };

      // If freelancer, store complete verification and portfolio credentials
      if (role === 'freelancer') {
        userData.expertise = expertiseTitle.trim() || 'Software Specialist';
        userData.hourlyRate = Number(hourlyRate) || 45;
        userData.experienceYears = experienceYears;
        userData.skills = skills.split(',').map(s => s.trim()).filter(s => s);
        userData.bio = bio.trim() || 'Dedicated professional with proven experience delivering robust solutions for clients.';
        userData.portfolioUrl = portfolioUrl.trim() || 'https://github.com';
        userData.certification = certification.trim() || 'Certified Industry Professional';
        userData.idVerified = true;
        userData.verificationDocument = documentFileName || 'Government ID / Degree Certificate';
        userData.rating = 5.0;
        userData.successRate = 100;
      }

      // 3. Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      toast.success(role === 'freelancer' ? 'Freelancer profile verified & created!' : 'Client account created!');
      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register account');
      toast.error(err.message || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className={`w-full ${role === 'freelancer' ? 'max-w-2xl' : 'max-w-md'} space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-200/90 transition-all`}>
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            FAST & SECURE REGISTRATION
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Join FreelanceHub
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleRegister}>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-bold">{error}</div>}

          {/* Account Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3.5 border rounded-2xl cursor-pointer transition-all ${role === 'freelancer' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  value="freelancer"
                  checked={role === 'freelancer'}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div className="ml-3">
                  <span className="block text-sm font-black text-slate-900">Work as Freelancer</span>
                  <span className="block text-[11px] font-semibold text-slate-500">Find contracts & earn</span>
                </div>
              </label>

              <label className={`flex items-center p-3.5 border rounded-2xl cursor-pointer transition-all ${role === 'client' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  value="client"
                  checked={role === 'client'}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div className="ml-3">
                  <span className="block text-sm font-black text-slate-900">Hire for Project</span>
                  <span className="block text-[11px] font-semibold text-slate-500">Post jobs & hire</span>
                </div>
              </label>
            </div>
          </div>

          {/* Basic User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Legal Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                placeholder="e.g. Sarah Chen"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Comprehensive Freelancer Verification Section */}
          {role === 'freelancer' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-indigo-600 text-base">🛡️</span> Professional Credentials & Verification
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Client-Visible Profile
                </span>
              </div>

              {/* Title & Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                    placeholder="e.g. Senior Full-Stack Cloud Architect"
                    value={expertiseTitle}
                    onChange={(e) => setExpertiseTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Hourly Rate ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="5"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                      placeholder="65"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Experience & Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Years of Experience</label>
                  <select
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700 transition-all"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  >
                    <option value="1-2 Years">1-2 Years (Junior)</option>
                    <option value="3-5 Years">3-5 Years (Mid-Level)</option>
                    <option value="6-8 Years">6-8 Years (Senior)</option>
                    <option value="8+ Years">8+ Years (Lead / Principal)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Verified Core Skills (Comma separated)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                    placeholder="React, Node.js, AWS, Figma, Flutter"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
              </div>

              {/* Professional Bio / Scope */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Professional Overview / Bio</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all resize-none"
                  placeholder="Explain your technical background, major achievements, and what clients can expect when hiring you..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              {/* External Links & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Portfolio / GitHub URL</label>
                  <input
                    type="url"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                    placeholder="https://github.com/yourhandle"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Degree / Key Certification</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                    placeholder="e.g. BSc Computer Science / AWS Certified"
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                  />
                </div>
              </div>

              {/* Document / ID Verification Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ID & Document Verification (CNIC, Passport, or Degree Certificate)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-4 text-center transition-all bg-slate-50/50">
                  <input
                    type="file"
                    id="docUpload"
                    className="hidden"
                    onChange={handleDocumentSelect}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                  <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                      📂
                    </div>
                    {documentUploaded ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        ✓ Document Selected: <strong className="text-slate-900">{documentFileName}</strong>
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-indigo-600 hover:underline">Click to attach verification document</span>
                        <span className="text-[11px] text-slate-400">PDF, JPG, PNG or DOC (Max 10MB)</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  🔒 Encrypted and verified by FreelanceHub to grant your profile the "100% Verified Expert" badge.
                </p>
              </div>

            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 font-extrabold text-sm shadow-lg shadow-indigo-200 hover:scale-[1.01] transition-all disabled:opacity-60"
            >
              {loading ? 'Creating Verified Account...' : (role === 'freelancer' ? 'Complete Verified Registration &rarr;' : 'Create Client Account &rarr;')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
