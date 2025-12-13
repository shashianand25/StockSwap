import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/logo.png';

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        // Start exit sequence after a delay
        const timer = setTimeout(() => {
            setExit(true);
            // Trigger callback after animation matches exit duration
            setTimeout(onComplete, 800);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!exit && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#fff] flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                >
                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{
                            scale: 50, // Massive zoom "flash"
                            opacity: 0,
                            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 1.5
                        }}
                        className="relative"
                    >
                        {/* Pulsing effect behind logo */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2
                            }}
                            className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-2xl"
                        />

                        <img
                            src={logo}
                            alt="StockSwap Logo"
                            className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
