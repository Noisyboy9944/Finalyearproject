import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CaretRight, Student, Brain, Users, ChalkboardTeacher, ArrowDown } from '@phosphor-icons/react';

// --- Helper Components ---

const SplitText = ({ text, delay = 0 }) => {
    return text.split("").map((char, index) => (
        <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + index * 0.05, duration: 0.5 }}
            className="inline-block"
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    ));
}

const FeatureSection = ({ title, desc, img, icon, align, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
        <section ref={ref} className="min-h-[80vh] flex items-center justify-center px-6 relative py-32">
             {/* Background Glow */}
             <div className={`absolute top-1/2 ${align === 'left' ? 'left-0' : 'right-0'} w-1/2 h-1/2 bg-marketing-primary/5 blur-[120px] rounded-full -z-10`} />

            <div className={`max-w-7xl w-full grid md:grid-cols-2 gap-20 items-center ${align === 'right' ? 'direction-rtl' : ''}`}>
                <motion.div 
                    style={{ opacity, x: align === 'left' ? -50 : 50 }}
                    transition={{ duration: 0.8 }}
                    className={`${align === 'right' ? 'md:order-2' : ''}`}
                >
                    <div className="p-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md"
                        >
                            {icon}
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight">
                            {title.split(" ").map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </h2>
                        <p className="text-xl font-mono text-marketing-fg/70 leading-relaxed max-w-lg">{desc}</p>
                    </div>
                </motion.div>
                
                <motion.div 
                    style={{ y, scale }}
                    className={`${align === 'right' ? 'md:order-1' : ''} relative`}
                >
                    <div className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-marketing-primary/20 rounded-[2rem] transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700 ease-out blur-md" />
                        <motion.img 
                            whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            src={img} 
                            alt={title} 
                            className="relative rounded-[2rem] shadow-2xl border border-white/10 w-full h-[500px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                        />
                         {/* Floating Badge */}
                         <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                            className="absolute -bottom-8 -right-8 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-xl"
                        >
                            <span className="text-marketing-primary font-mono text-xs">FEATURE 0{index}</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// --- Main Component ---

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="bg-marketing-bg text-marketing-fg min-h-screen font-sans selection:bg-marketing-primary selection:text-black overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-marketing-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-md bg-marketing-bg/30 border-b border-white/5 transition-all duration-300">
        <div className="text-2xl font-serif font-bold text-white tracking-tighter">UniLearnHub</div>
        <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 rounded-full border border-white/20 text-marketing-fg font-mono hover:bg-white/10 transition-colors">
                Login
            </Link>
            <Link to="/register" className="px-6 py-2 rounded-full bg-marketing-primary text-black font-mono font-bold hover:bg-marketing-primary/90 transition-transform hover:scale-105">
                Join Now
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden perspective-1000">
        <div className="absolute inset-0 z-0">
            <motion.div style={{ y: heroY }} className="w-full h-full">
                <img 
                    src="https://images.unsplash.com/photo-1680444873773-7c106c23ac52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc3MTc0MDU5MHww&ixlib=rb-4.1.0&q=85" 
                    className="w-full h-full object-cover opacity-30"
                    alt="University Architecture"
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-marketing-bg via-marketing-bg/80 to-marketing-bg" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <motion.div 
            style={{ opacity: heroOpacity }}
            className="z-10 text-center max-w-5xl px-6 relative"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute -top-32 -left-32 w-64 h-64 bg-marketing-primary/20 rounded-full blur-[100px] animate-pulse"
            />
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="absolute -bottom-32 -right-32 w-64 h-64 bg-marketing-secondary/20 rounded-full blur-[100px] animate-pulse"
            />

            <h1 className="text-6xl md:text-9xl font-serif font-medium text-white mb-8 leading-tight tracking-tight">
                <SplitText text="Knowledge is" delay={0} /> <br/> 
                <span className="text-marketing-primary italic">
                    <SplitText text="Limitless." delay={0.5} />
                </span>
            </h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl font-mono text-marketing-fg/80 mb-12 max-w-3xl mx-auto"
            >
                A new era of digital learning. Explore world-class courses, master complex subjects, and shape your future.
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col items-center gap-8"
            >
                <Link to="/register" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full text-lg font-mono font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10">Start Your Journey</span>
                    <CaretRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-marketing-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </Link>
                
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-white/30"
                >
                    <ArrowDown size={32} />
                </motion.div>
            </motion.div>
        </motion.div>
      </section>

      {/* Features Scrollytelling */}
      <div className="relative z-10 space-y-32 py-32">
        <FeatureSection 
            title="Expert Mentorship"
            desc="Learn directly from industry leaders and academic pioneers. Our instructors bring real-world experience to your screen, bridging the gap between theory and practice."
            img="https://images.pexels.com/photos/8197553/pexels-photo-8197553.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            icon={<ChalkboardTeacher size={32} className="text-marketing-primary" />}
            align="left"
            index={1}
        />
        
        <FeatureSection 
            title="Collaborative Growth"
            desc="Join a community of ambitious learners. Share notes, discuss ideas, and grow together in a thriving ecosystem designed for peer-to-peer connection."
            img="https://images.unsplash.com/photo-1741699427799-3fbb70fce948?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMGNvbGxhYm9yYXRpbmclMjBsYXB0b3AlMjBsaWJyYXJ5fGVufDB8fHx8MTc3MTc0MDU5MXww&ixlib=rb-4.1.0&q=85"
            icon={<Users size={32} className="text-marketing-accent" />}
            align="right"
            index={2}
        />

        <FeatureSection 
            title="AI-Powered Insights"
            desc="Smart recommendations and progress tracking help you stay on top of your learning goals. Our adaptive engine tailors the curriculum to your pace."
            img="https://images.pexels.com/photos/17483870/pexels-photo-17483870.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            icon={<Brain size={32} className="text-pink-500" />}
            align="left"
            index={3}
        />
      </div>

      {/* CTA Footer */}
      <section className="py-40 px-6 bg-marketing-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-serif text-white mb-10"
            >
                Ready to redefine <br/> your future?
            </motion.h2>
            <Link to="/register" className="inline-block px-12 py-5 bg-marketing-primary text-black text-xl font-bold rounded-full hover:scale-105 transition-transform hover:shadow-[0_0_50px_-10px_rgba(163,230,53,0.5)]">
                Get Started for Free
            </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
