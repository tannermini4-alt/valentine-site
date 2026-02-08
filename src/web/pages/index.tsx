import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

function Index() {
  const [isYes, setIsYes] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const noButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const moveNoButton = useCallback(() => {
    if (!isClient || !noButtonRef.current) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const btnRect = noButtonRef.current.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Get the current translation to calculate the base position
    const currentX = noPosition.x;
    const currentY = noPosition.y;

    // Natural position of the element (where it would be with x=0, y=0)
    const naturalX = btnRect.left - currentX;
    const naturalY = btnRect.top - currentY;

    // We want: 0 <= naturalX + nextX <= viewportWidth - btnWidth
    // So: -naturalX <= nextX <= viewportWidth - btnWidth - naturalX
    
    const minX = -naturalX + 16; // 16px padding
    const maxX = viewportWidth - btnWidth - naturalX - 16;
    const minY = -naturalY + 16;
    const maxY = viewportHeight - btnHeight - naturalY - 16;

    let randomX, randomY;
    let distance = 0;
    let attempts = 0;
    
    do {
      randomX = minX + Math.random() * (maxX - minX);
      randomY = minY + Math.random() * (maxY - minY);
      distance = Math.sqrt(Math.pow(randomX - currentX, 2) + Math.pow(randomY - currentY, 2));
      attempts++;
    } while (distance < 150 && attempts < 20);
    
    setNoPosition({ x: randomX, y: randomY });
    
    // Shrink "No" button slightly each time
    setNoScale(prev => Math.max(prev * 0.9, 0.5));
    
    // Grow "Yes" button significantly each time "No" is interacted with
    setYesScale(prev => Math.min(prev + 0.15, 3.5));
  }, [isClient, noPosition]);

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
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="z-30"
              >
                <Button
                  onClick={() => setIsYes(true)}
                  size="lg"
                  className="h-auto bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-16 py-8 text-4xl sm:text-5xl rounded-full shadow-[0_20px_50px_rgba(255,77,109,0.4)] transition-all font-montserrat font-black uppercase tracking-wider active:scale-90 border-none group"
                >
                  <span className="group-hover:scale-110 transition-transform inline-block mr-2">Да</span>💋
                </Button>
              </motion.div>

              <motion.div
                ref={noButtonRef}
                animate={{ 
                  x: noPosition.x, 
                  y: noPosition.y, 
                  scale: noScale,
                  rotate: noPosition.x / 10
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="z-20 sm:relative absolute"
              >
                <Button
                  onClick={moveNoButton}
                  onMouseEnter={moveNoButton}
                  onPointerDown={moveNoButton}
                  variant="outline"
                  size="lg"
                  className="h-auto border-4 border-[#ff4d6d] text-[#ff4d6d] bg-white/40 backdrop-blur-sm hover:bg-white px-10 py-6 text-2xl rounded-full shadow-lg transition-all font-montserrat font-bold whitespace-nowrap active:opacity-70"
                >
                  Нет🤔
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
              className="font-playfair text-[clamp(2rem,8vw,4.5rem)] font-bold text-[#ff4d6d] leading-tight max-w-4xl px-4"
            >
              УРАА, Я ОЧЕНЬ СИЛЬНО ТЕБЯ ЛЮБЛЮ ❤️
            </motion.h1>

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
                }}
                variant="ghost"
                className="text-[#ff758f] hover:text-[#ff4d6d] hover:bg-transparent mt-8"
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
