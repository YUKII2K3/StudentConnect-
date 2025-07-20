import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-royal flex items-center justify-center overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle w-2 h-2"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative text-center text-white">
        {/* Logo with royal animation */}
        <div className="animate-float-royal mb-8 relative">
          <div className="relative">
            <GraduationCap className="h-20 w-20 mx-auto mb-4 drop-shadow-glow" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 animate-pulse-royal text-secondary" />
          </div>
        </div>
        
        {/* Title with shimmer effect */}
        <h1 className="text-4xl font-bold mb-3 animate-fade-in bg-gradient-to-r from-white via-secondary to-white bg-clip-text text-transparent animate-shimmer">
          StudentConnect
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl opacity-90 animate-fade-in font-medium" style={{ animationDelay: '0.3s' }}>
          Connecting Students to Success...
        </p>
        
        {/* Royal loading spinner */}
        <div className="mt-10 flex justify-center">
          <div className="relative">
            <div className="spinner-royal h-12 w-12 rounded-full"></div>
            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-secondary/20"></div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6 w-48 mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};