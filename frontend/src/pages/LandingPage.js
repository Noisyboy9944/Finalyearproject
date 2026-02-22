import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CaretRight, Sparkle, Compass, Users, Trophy, Code, PaintBrush, TrendUp } from '@phosphor-icons/react';

// --- Assets ---
const IMAGES = {
    spark: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop", // Student thinking/writing
    chaos: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190&auto=format&fit=crop", // Library/Books
    clarity: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", // Clean minimal desk/laptop
    community: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop", // People working together
    success: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" // Graduation/Happy
};

const SHOWCASE_IMAGES = [
    {
        title: "Full Stack Development",
        desc: "Master React, Node.js, and Cloud Architecture.",
        img: "https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=2070&auto=format&fit=crop",
        icon: <Code size={32} />
    },
    {
        title: "UI/UX Design",
        desc: "Craft intuitive interfaces and user experiences.",
        img: "https://images.unsplash.com/photo-1726365222176-425a1a1b9b98?q=80&w=2070&auto=format&fit=crop",
        icon: <PaintBrush size={32} />
    },
    {
        title: "Data Science",
        desc: "Analyze trends and build predictive models.",
        img: "https://images.unsplash.com/photo-1531482984755-b51a25295306?q=80&w=2070&auto=format&fit=crop",
        icon: <TrendUp size={32} />
    }
];

// --- Components ---

const NarrativeSection = ({ step, currentStep, text, title, icon }) => {
    return (
        <motion.div 
            className={`min-h-screen flex flex-col justify-center p-8 md:p-16 max-w-2xl transition-opacity duration-500 ${Math.abs(currentStep - step) < 0.5 ? 'opacity-100 blur-0' : 'opacity-20 blur-sm'}`}
        >
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-marketing-primary/10 text-marketing-primary border border-marketing-primary/20">
                {icon}
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                {title}
            </h2>
            <p className="text-xl md:text-2xl font-mono text-marketing-fg/80 leading-relaxed">
                {text}
            </p>
        </motion.div>
    );
}

const ShowcaseCard = ({ item, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-3xl bg-marketing-surface border border-white/10"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <img src={item.img} alt={item.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="p-8 relative z-20">
                <div className="mb-4 text-marketing-primary">{item.icon}</div>
                <h3 className="text-2xl font-serif text-white mb-2">{item.title}</h3>
                <p className="text-marketing-fg/60 mb-6 font-mono text-sm">{item.desc}</p>
                <Link to="/register" className="inline-flex items-center gap-2 text-marketing-accent font-bold hover:gap-3 transition-all">
                    Explore Path <CaretRight />
                </Link>
            </div>
        </motion.div>
    );
}

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track which section is active based on scroll
  const [activeStep, setActiveStep] = useState(0);

  useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
        // Map scroll progress (0 to 1) to steps (0 to 6) - Adjusted for added section
        const step = latest * 6; 
        setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Hero Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
      target: heroRef,
      offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-marketing-bg text-marketing-fg font-sans selection:bg-marketing-primary selection:text-black">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-md bg-marketing-bg/30 border-b border-white/5">
        <div className="text-2xl font-serif font-bold text-white tracking-tighter">UniLearnHub</div>
        <div className="flex gap-4">
            <Link to="/login" className="hidden md:block px-6 py-2 rounded-full border border-white/20 text-marketing-fg font-mono hover:bg-white/10 transition-colors">
                Login
            </Link>
            <Link to="/register" className="px-6 py-2 rounded-full bg-marketing-primary text-black font-mono font-bold hover:bg-marketing-primary/90 transition-transform hover:scale-105">
                Start Learning
            </Link>
        </div>
      </nav>

      {/* --- SCENE 1: THE SPARK (HERO) --- */}
      <section ref={heroRef} className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-marketing-primary/10 via-marketing-bg to-marketing-bg opacity-50 blur-3xl animate-pulse" />
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="z-10 text-center px-6 max-w-5xl">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8 inline-block"
            >
                <span className="px-4 py-2 rounded-full border border-marketing-primary/30 text-marketing-primary bg-marketing-primary/5 font-mono text-sm tracking-widest uppercase">
                    The Journey Begins Here
                </span>
            </motion.div>
            
            <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="text-6xl md:text-9xl font-serif font-medium text-white mb-8 leading-none"
            >
                Knowledge <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketing-primary to-marketing-accent">
                    Awaits.
                </span>
            </motion.h1>

            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl md:text-2xl text-marketing-fg/60 max-w-2xl mx-auto font-mono mb-12"
            >
                Every expert was once a beginner who just refused to quit.
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                 <span className="text-sm font-mono text-marketing-fg/40">Scroll to unfold the story</span>
                 <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mt-4 flex justify-center text-marketing-fg/40"
                >
                    <CaretRight size={24} className="rotate-90" />
                </motion.div>
            </motion.div>
        </motion.div>
      </section>

      {/* --- THE NARRATIVE SCROLL CONTAINER --- */}
      <div ref={containerRef} className="relative">
        
        {/* Sticky Visual Background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden -z-10">
            {/* Image 1: Spark */}
            <motion.img 
                src={IMAGES.spark} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeStep < 1.5 ? 1 : 0 }}
            />
             {/* Image 2: Chaos */}
            <motion.img 
                src={IMAGES.chaos} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeStep >= 1.5 && activeStep < 2.5 ? 1 : 0 }}
            />
             {/* Image 3: Clarity */}
            <motion.img 
                src={IMAGES.clarity} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeStep >= 2.5 && activeStep < 3.5 ? 1 : 0 }}
            />
             {/* Image 4: Community (Extended for Showcase) */}
            <motion.img 
                src={IMAGES.community} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeStep >= 3.5 && activeStep < 5.5 ? 1 : 0 }}
            />
             {/* Image 5: Success (CTA) */}
            <motion.img 
                src={IMAGES.success} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeStep >= 5.5 ? 1 : 0 }}
            />

            {/* Overlay Gradient to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-marketing-bg via-marketing-bg/90 to-transparent md:w-3/4" />
        </div>

        {/* Scrolling Text Content */}
        <div className="relative z-10 -mt-[100vh]"> {/* Pull up to overlap with the sticky container's start */}
            
            {/* Spacer for the first image to show before text arrives */}
            <div className="h-[50vh]" />

            {/* Step 1 */}
            <NarrativeSection 
                step={1}
                currentStep={activeStep}
                icon={<Sparkle size={32} />}
                title="It starts with a question."
                text="Curiosity is the engine of growth. But in a world of infinite information, where do you even begin?"
            />

            {/* Step 2 */}
            <NarrativeSection 
                step={2}
                currentStep={activeStep}
                icon={<Compass size={32} />}
                title="The path is often unclear."
                text="Tutorial hell. Outdated documentation. Disconnected videos. Trying to piece it all together feels like solving a puzzle in the dark."
            />

            {/* Step 3 */}
            <NarrativeSection 
                step={3}
                currentStep={activeStep}
                icon={<Trophy size={32} />}
                title="Enter UniLearnHub."
                text="A structured, crystal-clear curriculum designed to take you from 'Hello World' to 'System Architect'. No fluff, just mastery."
            />

            {/* Step 4 */}
            <NarrativeSection 
                step={4}
                currentStep={activeStep}
                icon={<Users size={32} />}
                title="You never walk alone."
                text="Join a global classroom. Debate ideas, review code, and grow alongside thousands of other ambitious minds."
            />

            {/* Step 5: Showcase Grid (New Section) */}
             <div className={`min-h-screen flex flex-col justify-center p-8 transition-opacity duration-500 ${Math.abs(activeStep - 5) < 0.5 ? 'opacity-100 blur-0' : 'opacity-20 blur-sm'}`}>
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">Master In-Demand Skills</h2>
                    <div className="grid md:grid-cols-3 gap-8 w-full">
                        {SHOWCASE_IMAGES.map((item, index) => (
                            <ShowcaseCard key={index} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>

             {/* Step 6: Final CTA */}
             <div className={`min-h-screen flex flex-col justify-center p-8 md:p-16 max-w-3xl transition-opacity duration-500 ${Math.abs(activeStep - 6) < 0.5 ? 'opacity-100 blur-0' : 'opacity-20 blur-sm'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-marketing-surface/80 backdrop-blur-xl border border-white/10 p-12 rounded-3xl"
                >
                    <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">
                        Your future is waiting.
                    </h2>
                    <p className="text-xl text-marketing-fg/80 mb-10">
                        The only thing standing between you and your potential is the decision to start.
                    </p>
                    <Link to="/register" className="inline-flex w-full md:w-auto justify-center items-center gap-3 px-12 py-6 bg-marketing-primary text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_-10px_rgba(163,230,53,0.5)]">
                        Claim Your Spot <CaretRight size={24} weight="bold" />
                    </Link>
                </motion.div>
            </div>

            <div className="h-[20vh]" />
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
