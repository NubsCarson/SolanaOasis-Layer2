import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Text3D, Center } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const DocPortal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading for the animation
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 }
  };

  const portalAnimation = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const contentAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 2,
        duration: 0.8
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden">
      <Head>
        <title>Sacred Texts | Solana Oasis</title>
      </Head>

      {/* Portal Animation */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.8, 1],
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-mystic-purple to-digital-blue"
          />
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10"
      >
        <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center py-24">
          {/* Navigation */}
          <motion.nav 
            variants={contentAnimation}
            className="flex justify-center items-center mb-24"
          >
            <button 
              onClick={() => router.push('/')}
              className="text-mystic-purple hover:text-purple-400 transition-colors text-lg flex items-center gap-2 group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Return to the Void
            </button>
          </motion.nav>

          {/* Main Content */}
          <motion.div variants={contentAnimation} className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-16 text-center glow-text tracking-tight">Sacred Texts</h1>
            
            {/* Documentation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto w-full">
              {/* Architecture */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Architecture</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Explore the sacred foundations of our digital realm.</p>
                <a href="/docs/architecture" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* Protocol */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Protocol</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Understand the mystical protocols that power our network.</p>
                <a href="/docs/protocol" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* API */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">API</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Master the sacred incantations of our API.</p>
                <a href="/docs/api" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* Bridge */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Bridge</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Learn about the mystical bridge between realms.</p>
                <a href="/docs/bridge" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* Security */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Security</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Discover the wards that protect our digital sanctum.</p>
                <a href="/docs/security" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* SDK */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">SDK</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Wield the power of our development tools.</p>
                <a href="/docs/sdk" className="inline-flex items-center text-purple-400 hover:text-purple-300 group-hover:gap-2 transition-all">
                  Read more <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocPortal; 