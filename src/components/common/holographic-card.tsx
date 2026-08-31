"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Clock, FileText, CheckCircle, AlertTriangle } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

/**
 * HolographicCard — Option 4 hero visual.
 *
 * A CSS 3D transformed glass card representing the app's dashboard.
 * Responds to mouse movement for parallax tilt.
 * Floating stat chips orbit the card in 3D space using CSS animations.
 */
export function HolographicCard({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 15, y: -15 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15 + 15;
      const rotateY = ((x - centerX) / centerX) * 15 - 15;

      setRotation({ x: rotateX, y: rotateY });
    };

    const onMouseLeave = () => {
      setRotation({ x: 15, y: -15 });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative h-full w-full flex items-center justify-center perspective-[1200px] ${className}`}
      style={{ perspective: "1200px" }}
    >
      <div 
        ref={cardRef}
        className="relative w-[340px] h-[380px] sm:w-[420px] sm:h-[460px] transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Main Glass Card */}
        <div className="absolute inset-0 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/20 overflow-hidden flex flex-col">
          {/* Top Bar */}
          <div className="h-12 border-b border-slate-700/50 flex items-center px-4 bg-slate-800/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">Q3 Planning.mp4</div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Meeting Autopsy</h3>
                <p className="text-xs text-slate-400">Analysis complete</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">87</div>
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Health Score</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center text-blue-400 mb-1">
                  <CheckCircle size={14} className="mr-1.5" />
                  <span className="text-xs font-semibold">Decisions</span>
                </div>
                <div className="text-xl font-bold text-white">8</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center text-amber-400 mb-1">
                  <FileText size={14} className="mr-1.5" />
                  <span className="text-xs font-semibold">Actions</span>
                </div>
                <div className="text-xl font-bold text-white">12</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-2 flex-1 flex flex-col gap-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Timeline</div>
              
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                <div>
                  <div className="text-sm font-medium text-slate-200">Product vision aligned</div>
                  <div className="text-[10px] text-slate-500">12:04 - Consensus reached</div>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                <div>
                  <div className="text-sm font-medium text-slate-200">Tangent detected</div>
                  <div className="text-[10px] text-slate-500">18:30 - Wasted 8 minutes</div>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <div>
                  <div className="text-sm font-medium text-slate-200">Action item assigned</div>
                  <div className="text-[10px] text-slate-500">24:15 - Sarah</div>
                </div>
              </div>
            </div>
            
            {/* Audio Waveform decorative */}
            <div className="h-8 mt-auto flex items-center justify-center gap-1 opacity-60">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 rounded-full bg-indigo-500/80" 
                    style={{ 
                      height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}px`,
                      opacity: 0.3 + Math.random() * 0.7
                    }} 
                  />
                ))}
            </div>
          </div>
          
          {/* Overlay Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-400/10 pointer-events-none"></div>
        </div>

        {/* Floating Chips */}
        {/* Top Right */}
        <div 
          className="absolute -right-8 -top-4 bg-slate-800/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 transform translate-z-[40px] animate-pulse"
          style={{ transform: "translateZ(60px)", animationDuration: "3s" }}
        >
          <Activity size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">87% Health</span>
        </div>

        {/* Bottom Left */}
        <div 
          className="absolute -left-12 bottom-16 bg-slate-800/90 border border-amber-500/30 shadow-lg shadow-amber-500/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 transform translate-z-[50px] animate-pulse"
          style={{ transform: "translateZ(80px)", animationDuration: "4s" }}
        >
          <AlertTriangle size={16} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-400">3 Risks Found</span>
        </div>

        {/* Bottom Right */}
        <div 
          className="absolute -right-4 -bottom-6 bg-slate-800/90 border border-blue-500/30 shadow-lg shadow-blue-500/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 transform translate-z-[30px] animate-pulse"
          style={{ transform: "translateZ(40px)", animationDuration: "2.5s" }}
        >
          <Clock size={16} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400">-18m Wasted</span>
        </div>
      </div>
    </div>
  );
}

export default HolographicCard;
