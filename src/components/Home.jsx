import { useState, useEffect } from 'react';

export default function Home() {
    const [showBlood, setShowBlood] = useState(false);
    const [bloodDrops, setBloodDrops] = useState([]);
    const [bloodCoverage, setBloodCoverage] = useState(0);
    const [bloodStreaks, setBloodStreaks] = useState([]);
    const [audioContext, setAudioContext] = useState(null);
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);
    const [scaryWords, setScaryWords] = useState([]);

const scaryWordsList = [
  "We are watching you.",
  "Look at your bathroom.",
  "I see you.",
  "Something will happen tonight.",
  "They’re outside your window.",
  "Don’t turn around.",
  "Your name is whispered in the dark.",
  "Something’s waiting for you."
];



    // Auto-initialize audio after 10 seconds
    const initAudio = () => {
        if (!isAudioInitialized) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            setAudioContext(ctx);
            setIsAudioInitialized(true);
        }
    };

    // Create creepy ambient drone sound
    const createAmbientDrone = (ctx) => {
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const oscillator3 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();

        oscillator1.frequency.setValueAtTime(55, ctx.currentTime); // Low A
        oscillator2.frequency.setValueAtTime(82.4, ctx.currentTime); // Low E
        oscillator3.frequency.setValueAtTime(110, ctx.currentTime); // A

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(200, ctx.currentTime);
        filterNode.Q.setValueAtTime(10, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);

        oscillator1.connect(filterNode);
        oscillator2.connect(filterNode);
        oscillator3.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator1.start();
        oscillator2.start();
        oscillator3.start();

        // Add subtle frequency modulation for unease
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator1.frequency);
        lfo.start();

        return { oscillator1, oscillator2, oscillator3, lfo };
    };

    // Create dripping sound effect
    const createDripSound = (ctx) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();

        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(1000, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
    };

    // Create evil laugh sound
    const createEvilLaugh = (ctx) => {
        const duration = 2 + Math.random() * 3; // 2-5 seconds
        const laughSegments = 5 + Math.floor(Math.random() * 8); // 5-12 "ha" sounds
        
        for (let i = 0; i < laughSegments; i++) {
            const startTime = ctx.currentTime + (i * duration / laughSegments);
            const segmentDuration = 0.15 + Math.random() * 0.2;
            
            // Create the "HA" sound with multiple oscillators for richness
            const createLaughSegment = (time, pitch, intensity) => {
                // Main voice oscillator
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator(); // Harmonic
                const osc3 = ctx.createOscillator(); // Sub-harmonic for evil depth
                
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                
                // Frequencies for evil laugh (lower = more menacing)
                osc1.frequency.setValueAtTime(pitch, time);
                osc1.frequency.exponentialRampToValueAtTime(pitch * 0.7, time + segmentDuration);
                
                osc2.frequency.setValueAtTime(pitch * 1.5, time);
                osc2.frequency.exponentialRampToValueAtTime(pitch * 1.2, time + segmentDuration);
                
                osc3.frequency.setValueAtTime(pitch * 0.5, time);
                osc3.frequency.exponentialRampToValueAtTime(pitch * 0.35, time + segmentDuration);
                
                // Evil formant filter
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800 + Math.random() * 400, time);
                filter.Q.setValueAtTime(5, time);
                
                // Volume envelope for "HA" attack
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(intensity, time + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, time + segmentDuration);
                
                osc1.connect(filter);
                osc2.connect(filter);
                osc3.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                osc1.start(time);
                osc2.start(time);
                osc3.start(time);
                osc1.stop(time + segmentDuration);
                osc2.stop(time + segmentDuration);
                osc3.stop(time + segmentDuration);
            };
            
            // Vary pitch and intensity for realistic evil laugh
            const basePitch = 120 + Math.random() * 60; // 120-180 Hz
            const intensity = 0.08 + Math.random() * 0.05;
            
            createLaughSegment(startTime, basePitch, intensity);
            
            // Add slight delay/echo for more evil effect
            if (Math.random() > 0.7) {
                createLaughSegment(startTime + 0.05, basePitch * 0.9, intensity * 0.6);
            }
        }
    };

    // Create whisper-like white noise
    const createWhisper = (ctx) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();
        
        source.buffer = buffer;
        source.loop = true;
        
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(3000, ctx.currentTime);
        filterNode.Q.setValueAtTime(0.5, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 3);
        
        source.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        source.start();
        return source;
    };

    useEffect(() => {
        // Start everything after 10 seconds automatically
        const timer = setTimeout(() => {
            setShowBlood(true);
            initAudio();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!showBlood) return;

        let drone, whisper;

        // Initialize audio if needed
        if (audioContext) {
            // Start ambient drone
            drone = createAmbientDrone(audioContext);
            
            // Start whispers
            whisper = createWhisper(audioContext);
        }

        // Create blood drops continuously
        const dropInterval = setInterval(() => {
            const newDrop = {
                id: Math.random(),
                left: Math.random() * 100,
                size: 3 + Math.random() * 5,
                speed: 2 + Math.random() * 3,
                trail: Math.random() > 0.5
            };
            
            setBloodDrops(prev => [...prev, newDrop]);
            
            // Play drip sound occasionally
            if (audioContext && Math.random() > 0.7) {
                createDripSound(audioContext);
            }
            
            // Remove drops after they fall
            setTimeout(() => {
                setBloodDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
            }, 8000);
        }, 150 + Math.random() * 300);

        // Create blood streaks that flow down
        const streakInterval = setInterval(() => {
            const newStreak = {
                id: Math.random(),
                left: Math.random() * 100,
                width: 1 + Math.random() * 3,
                opacity: 0.6 + Math.random() * 0.4
            };
            
            setBloodStreaks(prev => [...prev, newStreak]);
            
            setTimeout(() => {
                setBloodStreaks(prev => prev.filter(streak => streak.id !== newStreak.id));
            }, 12000);
        }, 800 + Math.random() * 1200);

        // Gradually increase blood coverage
        const coverageInterval = setInterval(() => {
            setBloodCoverage(prev => Math.min(prev + 0.5, 100));
        }, 200);

        // Random evil laugh sounds
        const laughInterval = setInterval(() => {
            if (audioContext && Math.random() > 0.5) {
                createEvilLaugh(audioContext);
            }
        }, 8000 + Math.random() * 12000);

        // Random scary words appearing
        const wordsInterval = setInterval(() => {
            const randomWord = scaryWordsList[Math.floor(Math.random() * scaryWordsList.length)];
            const newWord = {
                id: Math.random(),
                text: randomWord,
                left: Math.random() * 80 + 10, // 10-90% to avoid edges
                top: Math.random() * 80 + 10,
                size: 20 + Math.random() * 40,
                opacity: 0.6 + Math.random() * 0.4,
                duration: 2000 + Math.random() * 4000, // 2-6 seconds
                glitch: Math.random() > 0.7 // Some words have glitch effect
            };
            
            setScaryWords(prev => [...prev, newWord]);
            
            setTimeout(() => {
                setScaryWords(prev => prev.filter(word => word.id !== newWord.id));
            }, newWord.duration);
        }, 1500 + Math.random() * 3000); // Every 1.5-4.5 seconds

        return () => {
            clearInterval(dropInterval);
            clearInterval(streakInterval);
            clearInterval(coverageInterval);
            clearInterval(laughInterval);
            clearInterval(wordsInterval);
            
            // Stop audio
            if (drone) {
                drone.oscillator1.stop();
                drone.oscillator2.stop();
                drone.oscillator3.stop();
                drone.lfo.stop();
            }
            if (whisper) {
                whisper.stop();
            }
        };
    }, [showBlood, audioContext]);

    return (
        <>
            <div className="relative flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
                
                {/* Main text */}
                <div className="relative z-20 text-center px-4">
                    <p className={`text-center mt-4 text-lg transition-all duration-2000 ${
                        bloodCoverage > 50 
                            ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                            : 'text-gray-800'
                    }`}>
                        Thank you for joining. The ritual begins at midnight. Bring snacks.
                    </p>
                    
                    {showBlood && bloodCoverage > 30 && (
                        <div className="mt-8 text-red-400 text-sm opacity-70 animate-pulse">
                            {bloodCoverage > 70 ? "Muahahaha... the ritual is complete!" : "Do you hear the laughter in the darkness?"}
                        </div>
                    )}
                </div>

                {/* Scary words appearing randomly */}
                {showBlood && scaryWords.map((word) => (
                    <div
                        key={word.id}
                        className={`absolute z-25 font-bold text-red-600 select-none pointer-events-none ${
                            word.glitch ? 'animate-pulse' : ''
                        }`}
                        style={{
                            left: `${word.left}%`,
                            top: `${word.top}%`,
                            fontSize: `${word.size}px`,
                            opacity: word.opacity,
                            animation: word.glitch 
                                ? `scaryWordGlitch ${word.duration}ms ease-in-out forwards`
                                : `scaryWordFade ${word.duration}ms ease-in-out forwards`,
                            textShadow: '0 0 10px rgba(139, 0, 0, 0.8), 0 0 20px rgba(139, 0, 0, 0.6)',
                            fontFamily: 'Impact, Arial Black, sans-serif',
                            letterSpacing: '2px'
                        }}
                    >
                        {word.text}
                    </div>
                ))}

                {/* Blood coverage overlay that gradually takes over */}
                {showBlood && (
                    <div 
                        className="absolute inset-0 transition-opacity duration-1000 z-10"
                        style={{
                            background: `radial-gradient(circle at 50% 0%, 
                                rgba(139, 0, 0, ${bloodCoverage * 0.01}) 0%, 
                                rgba(120, 0, 0, ${bloodCoverage * 0.008}) 30%, 
                                rgba(100, 0, 0, ${bloodCoverage * 0.006}) 60%, 
                                rgba(80, 0, 0, ${bloodCoverage * 0.004}) 100%)`
                        }}
                    />
                )}

                {/* Realistic blood drops */}
                {showBlood && bloodDrops.map((drop) => (
                    <div
                        key={drop.id}
                        className="absolute z-15"
                        style={{
                            left: `${drop.left}%`,
                            top: '0',
                            width: `${drop.size}px`,
                            height: `${drop.size}px`,
                            background: 'radial-gradient(circle, #8B0000 0%, #660000 50%, #4A0000 100%)',
                            borderRadius: '60% 40% 60% 40%',
                            animation: `realisticBloodDrop ${drop.speed}s linear forwards`,
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))',
                            transform: 'rotate(45deg)'
                        }}
                    >
                        {/* Blood trail behind the drop */}
                        {drop.trail && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '50%',
                                    width: '1px',
                                    height: '10px',
                                    background: 'linear-gradient(to bottom, transparent, #8B0000)',
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* Blood streaks flowing down */}
                {showBlood && bloodStreaks.map((streak) => (
                    <div
                        key={streak.id}
                        className="absolute z-15"
                        style={{
                            left: `${streak.left}%`,
                            top: '0',
                            width: `${streak.width}px`,
                            height: '100vh',
                            background: `linear-gradient(to bottom, 
                                rgba(139, 0, 0, ${streak.opacity}) 0%, 
                                rgba(139, 0, 0, ${streak.opacity * 0.8}) 20%, 
                                rgba(139, 0, 0, ${streak.opacity * 0.6}) 40%, 
                                rgba(139, 0, 0, ${streak.opacity * 0.4}) 60%, 
                                rgba(139, 0, 0, ${streak.opacity * 0.2}) 80%, 
                                transparent 100%)`,
                            animation: 'bloodStreakFlow 12s linear forwards',
                            transformOrigin: 'top'
                        }}
                    />
                ))}

                {/* Blood accumulation at edges */}
                {showBlood && bloodCoverage > 20 && (
                    <>
                        <div 
                            className="absolute top-0 w-full z-10"
                            style={{
                                height: `${Math.min(bloodCoverage * 0.3, 30)}px`,
                                background: `linear-gradient(to bottom, 
                                    rgba(139, 0, 0, ${Math.min(bloodCoverage * 0.01, 0.9)}) 0%, 
                                    rgba(139, 0, 0, ${Math.min(bloodCoverage * 0.005, 0.6)}) 50%, 
                                    transparent 100%)`
                            }}
                        />
                        <div 
                            className="absolute bottom-0 w-full z-10"
                            style={{
                                height: `${Math.min(bloodCoverage * 0.5, 50)}px`,
                                background: `linear-gradient(to top, 
                                    rgba(139, 0, 0, ${Math.min(bloodCoverage * 0.012, 0.9)}) 0%, 
                                    rgba(139, 0, 0, ${Math.min(bloodCoverage * 0.008, 0.7)}) 30%, 
                                    transparent 100%)`
                            }}
                        />
                    </>
                )}

                {/* Final blood takeover */}
                {bloodCoverage > 80 && (
                    <div 
                        className="absolute inset-0 z-5"
                        style={{
                            background: `linear-gradient(135deg, 
                                rgba(139, 0, 0, 0.8) 0%, 
                                rgba(120, 0, 0, 0.9) 25%, 
                                rgba(100, 0, 0, 0.95) 50%, 
                                rgba(80, 0, 0, 0.9) 75%, 
                                rgba(60, 0, 0, 0.8) 100%)`,
                            animation: 'bloodPulse 3s ease-in-out infinite'
                        }}
                    />
                )}
            </div>

            <style jsx>{`
                @keyframes realisticBloodDrop {
                    0% {
                        transform: translateY(-20px) rotate(45deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(50vh) rotate(45deg) scale(1.1);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(100vh) rotate(45deg) scale(0.8);
                        opacity: 0.7;
                    }
                }
                
                @keyframes bloodStreakFlow {
                    0% {
                        transform: scaleY(0);
                        opacity: 0;
                    }
                    10% {
                        transform: scaleY(0.1);
                        opacity: 1;
                    }
                    100% {
                        transform: scaleY(1);
                        opacity: 0.8;
                    }
                }
                
                @keyframes bloodPulse {
                    0%, 100% {
                        opacity: 0.8;
                    }
                    50% {
                        opacity: 0.95;
                    }
                }
                
                @keyframes scaryWordFade {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) rotate(-5deg);
                    }
                    20% {
                        opacity: 1;
                        transform: scale(1.1) rotate(2deg);
                    }
                    80% {
                        opacity: 1;
                        transform: scale(1) rotate(-1deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.8) rotate(5deg);
                    }
                }
                
                @keyframes scaryWordGlitch {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) skew(-5deg, 2deg);
                        filter: hue-rotate(0deg);
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1.2) skew(3deg, -1deg);
                        filter: hue-rotate(90deg);
                    }
                    20% {
                        opacity: 0.8;
                        transform: scale(0.9) skew(-2deg, 3deg);
                        filter: hue-rotate(180deg);
                    }
                    30% {
                        opacity: 1;
                        transform: scale(1.1) skew(1deg, -2deg);
                        filter: hue-rotate(270deg);
                    }
                    70% {
                        opacity: 0.9;
                        transform: scale(1) skew(-1deg, 1deg);
                        filter: hue-rotate(360deg);
                    }
                    90% {
                        opacity: 0.7;
                        transform: scale(1.05) skew(2deg, -3deg);
                        filter: hue-rotate(45deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.7) skew(-3deg, 2deg);
                        filter: hue-rotate(0deg);
                    }
                }
            `}</style>
        </>
    );
}