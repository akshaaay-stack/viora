import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Search, Heart, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { userPhone, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className=sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-viora-border>
      <div className=max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between>
        <Link to=/ className=flex items-center gap-2.5>
          <div className=w-9 h-9 rounded-xl bg-viora-navy flex items-center justify-center text-white shadow-sm>
            <Droplet className=w-5 h-5 text-viora-red fill-viora-red />
          </div>
          <div>
            <span className=font-extrabold text-lg tracking-tight text-viora-navy>VIORA</span>
            <span className=hidden sm:inline ml-2 text-xs text-viora-muted font-medium>Blood. When it matters.</span>
          </div>
        </Link>

        <nav className=hidden md:flex items-center gap-6 text-sm font-semibold text-viora-text>
          <Link to=/ className=hover:text-viora-red transition>Home</Link>
          <Link to=/donor/phone className=hover:text-viora-red transition>For Donors</Link>
          <Link to=/requester/phone className=hover:text-viora-red transition>For Requesters</Link>
          <Link to=/operations className=text-xs font-semibold px-3 py-1.5 rounded-full bg-viora-navy-surface text-viora-navy flex items-center gap-1.5>
            <span className=w-2 h-2 rounded-full bg-emerald-500 animate-pulse></span>
            <span>Live Ops</span>
          </Link>
        </nav>

        <div className=flex items-center gap-3>
          {userPhone ? (
            <div className=flex items-center gap-2>
              <span className=text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-viora-navy border border-slate-200 hidden sm:inline>
                {userPhone}
              </span>
              <button
                onClick={() => signOut()}
                className=text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 transition
              >
                Logout
              </button>
            </div>
          ) : (
            <div className=flex items-center gap-2.5>
              <button
                onClick={() => navigate('/requester/phone')}
                className=viora-btn-primary px-5 py-2 text-sm flex items-center gap-1.5
              >
                <Search className=w-4 h-4 />
                <span>I Need Blood</span>
              </button>
              <button
                onClick={() => navigate('/donor/phone')}
                className=viora-btn-secondary px-5 py-2 text-sm hidden sm:flex items-center gap-1.5
              >
                <Heart className=w-4 h-4 />
                <span>Donate</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
