import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

function Index() {
  const [isYes, setIsYes] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const noButtonRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const moveNoButton = useCallback(() => {
    if (!isClient || !noButtonRef.current) return;
    
    const btnRect = noButtonRef.current.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const padding = 24;
    const maxX = viewportWidth - btnWidth - padding;
    const maxY = viewportHeight - btnHeight - padding;

    // Calculate new random position within viewport
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    if (!hasMoved) {
      // First move: capture current position to prevent jumping
      setNoPosition({ x: btnRect.left, y: btnRect.top });
      setHasMoved(true);
      
      // Delay the actual random jump to the next tick to allow the state change to take effect
      // and let Framer Motion handle the transition from the captured position to the random one
      setTimeout(() => {
        setNoPosition({ x: randomX, y: randomY });
      }, 0);
    } else {
      setNoPosition({ x: randomX, y: randomY });
    }
    
    // Shrink "No" button slightly each time
    setNoScale(prev => Math.max(prev * 0.85, 0.4));
    
    // Grow "Yes" button significantly each time "No" is interacted with
    setYesScale(prev => Math.min(prev + 0.2, 4.0));
  }, [isClient, hasMoved]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#fff0f3] flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans selection:bg-[#ffb3c1] selection:text-[#ff4d6d]">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: `radial-gradient(#ff4d6d 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffccd5] via-transparent to-transparent"></div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Dancing+Script:wght@700&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .font-dancing {
          font-family: 'Dancing Script', cursive;
        }
      `}</style>

      {/* Background Hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + "%", rotate: 0 }}
            animate={{ 
              y: "110vh",
              x: (Math.random() * 100) + "%",
              rotate: 360 
            }}
            transition={{ 
              duration: Math.random() * 15 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute text-red-400 text-3xl"
          >
            {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "💖" : "💕"}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isYes ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="z-10 flex flex-col items-center gap-12 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-8xl md:text-9xl mb-4 drop-shadow-xl"
            >
              ❤️‍🔥
            </motion.div>
            
            <h1 className="font-playfair text-[clamp(2.5rem,10vw,6rem)] font-bold text-[#ff4d6d] leading-[1.1] max-w-4xl drop-shadow-sm px-4">
              Ты будешь моей валентинкой ?❤️
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 min-h-[200px] relative w-full px-4">
              <motion.div
                style={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="z-30"
              >
                <Button
                  onClick={() => setIsYes(true)}
                  size="lg"
                  className="h-auto bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-16 py-8 text-4xl sm:text-5xl rounded-full shadow-[0_20px_50px_rgba(255,77,109,0.4)] transition-all font-montserrat font-black uppercase tracking-wider active:scale-90 border-none group relative overflow-hidden"
                >
                  <motion.span 
                    className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                  <span className="relative z-10 group-hover:scale-110 transition-transform inline-block mr-2">Да</span>💋
                </Button>
              </motion.div>

              <motion.div
                ref={noButtonRef}
                style={hasMoved ? {
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  x: noPosition.x,
                  y: noPosition.y,
                  margin: 0,
                  zIndex: 50
                } : {}}
                animate={hasMoved ? { 
                  x: noPosition.x, 
                  y: noPosition.y, 
                  scale: noScale,
                  rotate: [0, -5, 5, 0]
                } : {
                  scale: noScale
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30,
                  rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
                }}
                className="z-20 sm:relative"
              >
                <Button
                  onClick={moveNoButton}
                  onMouseEnter={moveNoButton}
                  onPointerDown={moveNoButton}
                  variant="outline"
                  size="lg"
                  className="h-auto border-4 border-[#ff4d6d] text-[#ff4d6d] bg-white/60 backdrop-blur-md hover:bg-white px-10 py-6 text-2xl rounded-full shadow-xl transition-all font-montserrat font-bold whitespace-nowrap active:opacity-70 group"
                >
                  <span className="group-hover:rotate-12 transition-transform inline-block">Нет🤔</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 flex flex-col items-center gap-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-[10rem] md:text-[15rem] drop-shadow-2xl"
            >
              😻
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="font-playfair text-[clamp(2rem,8vw,4.5rem)] font-bold text-[#ff4d6d] leading-tight max-w-4xl px-4 drop-shadow-sm"
            >
              УРАА, Я ОЧЕНЬ СИЛЬНО ТЕБЯ ЛЮБЛЮ ❤️
            </motion.h1>

            {/* Heart Explosion */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 150}%`,
                    y: `${50 + (Math.random() - 0.5) * 150}%`,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                  className="absolute text-4xl"
                >
                  {["❤️", "💖", "💝", "💕", "💗"][i % 5]}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4"
            >
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    className="text-4xl"
                  >
                    💖
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
               <Button
                onClick={() => {
                  setIsYes(false);
                  setYesScale(1);
                  setNoScale(1);
                  setNoPosition({ x: 0, y: 0 });
                  setHasMoved(false);
                }}
                variant="ghost"
                className="text-[#ff758f] hover:text-[#ff4d6d] hover:bg-transparent mt-8 font-montserrat font-semibold"
              >
                Попробовать еще раз? ✨
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-0 right-0 text-center text-[#ff8fa3] font-montserrat text-xs tracking-widest opacity-40 uppercase">
        Happy Valentine's Day
      </div>
    </div>
  );
}

export default Index;
