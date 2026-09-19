import React, { useState } from 'react';
import { KERALA_DISTRICTS } from './utils/districts';
import { BLOOD_GROUPS, BloodGroup } from './utils/bloodGroups';
import { Navbar } from './components/ui/Navbar';

export function App() {
  const [activeTab, setActiveTab] = useState<'request' | 'donor' | 'tracker' | 'hospitals' | 'privacy'>('request');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">VIORA</h1>
          <p className="text-slate-600 mt-2">Kerala District Blood Donor Matching Platform</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Challenge SC-12 Live Node
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
