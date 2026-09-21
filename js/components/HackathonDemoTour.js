/**
 * VIORA Hackathon 60-90 Second Interactive Demo Tour
 * Drives live Supabase database operations to prove SC-12 requirements in a smooth guided sequence.
 */

import { store } from '../store.js';
import { VioraAPI } from '../api.js';

export function renderDemoTourBar() {
  const currentStep = window.vioraDemoStep || 0;
  if (currentStep === 0) return '';

  const steps = [
    {
      title: 'Step 1: Landing Page & SC-12 Core Solution',
      desc: 'Notice the tagline: "The right donor, at the right moment — not everyone, all at once." Replaces broadcast spam with precision district matching.',
      actionText: 'Next: Create Emergency Request',
      onAction: () => window.vioraApp.advanceDemoTour(2)
    },
    {
      title: 'Step 2: Emergency Request Dispatch',
      desc: 'Submitting a real request: 2 units of O+ at Aster Medcity, Ernakulam with Urgent priority.',
      actionText: 'Execute Live Request & Match',
      onAction: async () => {
        await window.vioraApp.autoFillAndSubmitDemoRequest();
        window.vioraApp.advanceDemoTour(3);
      }
    },
    {
      title: 'Step 3: Database Matching & 90-Day Exclusion Proof',
      desc: 'The matching engine selected compatible Ernakulam donors, while Rohan Mathew (<90 days) was EXCLUDED from notifications!',
      actionText: 'Switch to Matched Donor View',
      onAction: () => {
        window.vioraApp.switchRole('donor');
        window.vioraApp.advanceDemoTour(4);
      }
    },
    {
      title: 'Step 4: Donor Inbox & Acceptance Flow',
      desc: 'Donor sees targeted notification without unnecessary personal requester spam. Tap "ACCEPT REQUEST" below to volunteer.',
      actionText: 'Accept Request as Donor',
      onAction: async () => {
        await window.vioraApp.autoAcceptFirstMatch();
        window.vioraApp.advanceDemoTour(5);
      }
    },
    {
      title: 'Step 5: Contact Reveal Privacy Gate Unlocked!',
      desc: 'Both donor and requester can now coordinate directly via phone and WhatsApp. Privacy was strictly protected until acceptance.',
      actionText: 'Complete Tour & Open Admin',
      onAction: () => {
        window.vioraApp.navigateTo('admin');
        window.vioraApp.endDemoTour();
      }
    }
  ];

  const activeStep = steps[currentStep - 1] || steps[0];

  return `
    <div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border-2 border-amber-500/80 animate-bounce-short">
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
            Judge Demo Tour (${currentStep}/5)
          </span>
        </div>
        <button onclick="window.vioraApp.endDemoTour()" class="text-slate-400 hover:text-white text-xs font-bold">
          ✕ Close
        </button>
      </div>

      <h4 class="text-sm font-extrabold text-white font-display mb-1">${activeStep.title}</h4>
      <p class="text-xs text-slate-300 leading-relaxed mb-4">${activeStep.desc}</p>

      <div class="flex items-center gap-2">
        <button onclick="window.vioraApp.runDemoStepAction()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5">
          <span>${activeStep.actionText}</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `;
}
