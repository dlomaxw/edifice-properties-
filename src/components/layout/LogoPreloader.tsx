'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogoPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the preloader has already been run in this tab session
    const isLoaded = sessionStorage.getItem('edifice_session_loaded');
    if (isLoaded) {
      setLoading(false);
      return;
    }

    // Set a timer to close the preloader after the animation completes
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('edifice_session_loaded', 'true');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            opacity: 0,
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020c1b] text-white select-none overflow-hidden"
        >
          {/* Glowing background radial highlights representing luxury */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#dfc28c]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative max-w-xs md:max-w-md w-full px-8 flex flex-col items-center gap-6 z-10">
            {/* Rotating Luxury Golden Ring */}
            <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
              <motion.svg
                width="280"
                height="120"
                viewBox="0 0 280 120"
                fill="none"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ 
                  opacity: [0, 0.4, 0.4, 0], 
                  rotate: 0,
                  transition: { duration: 2.2, ease: 'easeOut' }
                }}
                className="w-full h-full"
              >
                <rect 
                  x="2" 
                  y="2" 
                  width="276" 
                  height="116" 
                  rx="20" 
                  stroke="#dfc28c" 
                  strokeWidth="1" 
                  strokeDasharray="40 160"
                />
              </motion.svg>
            </div>

            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                filter: 'blur(0px)',
                transition: { 
                  duration: 1.6, 
                  ease: [0.16, 1, 0.3, 1] 
                } 
              }}
              className="relative w-full aspect-[3.2/1] drop-shadow-[0_0_35px_rgba(223,194,140,0.25)] flex items-center justify-center"
            >
              <img 
                src="/assets/images/edifice-logo.svg" 
                alt="Edifice Properties Logo" 
                className="w-full h-full object-contain filter brightness-110 contrast-125" 
              />
            </motion.div>

            {/* Elegant Center-Expanding Loading Bar */}
            <div className="relative w-48 h-[1px] bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ left: '50%', right: '50%' }}
                animate={{ 
                  left: '0%', 
                  right: '0%',
                  transition: { 
                    duration: 2.2, 
                    ease: [0.16, 1, 0.3, 1] 
                  } 
                }}
                className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-[#dfc28c] to-transparent"
              />
            </div>

            {/* Subtle Tagline */}
            <motion.p
              initial={{ y: 12, opacity: 0, letterSpacing: '0.2em' }}
              animate={{ 
                y: 0, 
                opacity: 0.8,
                letterSpacing: '0.35em',
                transition: { delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
              }}
              className="text-[10px] uppercase text-[#dfc28c] font-heading font-semibold text-center mt-2"
            >
              Redefining Urban Spaces
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
