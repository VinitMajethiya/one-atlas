'use client';

import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Loader2 } from 'lucide-react';

interface GeneratingOverlayProps {
  appName: string;
  onComplete: () => void;
}

const STEPS = [
  'Parsing abstract template schema...',
  'Configuring database tables and indices...',
  'Assembling layout grids and nav panels...',
  'Populating mock dataset matrices...',
  'Deploying app snapshot endpoints...',
];

export function GeneratingOverlay({ appName, onComplete }: GeneratingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Steps animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(stepInterval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          // Accelerate progress slightly
          const diff = Math.floor(Math.random() * 8) + 2;
          return Math.min(prev + diff, 100);
        } else {
          clearInterval(progressInterval);
          // Wait briefly before completing
          setTimeout(onComplete, 500);
          return 100;
        }
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-default grid-mesh transition-standard">
      <div className="max-w-md w-full px-6 text-center">
        {/* Spinning glowing compass */}
        <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20">
          <Compass className="h-10 w-10 text-primary animate-spin-slow" />
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg pointer-events-none animate-pulse" />
        </div>

        {/* Text */}
        <h2 className="text-xl md:text-2xl font-extrabold text-text-heading mb-2 tracking-tight">
          Assembling Workspace App
        </h2>
        <p className="text-sm text-text-muted font-bold mb-8">
          Generating {appName || 'Custom Application'}...
        </p>

        {/* Progress bar container */}
        <div className="w-full bg-bg-subtle border border-border-default h-2.5 rounded-full overflow-hidden mb-8 shadow-inner">
          <div
            className="h-full bg-gradient-hero transition-standard"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step list */}
        <div className="space-y-3.5 text-left bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isCompleted || isActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border-default shrink-0" />
                )}
                <span className={`text-xs md:text-sm font-bold ${
                  isActive ? 'text-primary' : isCompleted ? 'text-text-heading' : 'text-text-muted'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GeneratingOverlay;
