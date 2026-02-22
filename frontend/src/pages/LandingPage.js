import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CaretRight, Student, Brain, Users, ChalkboardTeacher } from '@phosphor-icons/react';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div className="bg-marketing-bg text-marketing-fg min-h-screen font-sans selection:bg-marketing-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-marketing-bg/50 border-b border-white/5">
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
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1680444873773-7c106c23ac52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc3MTc0MDU5MHww&ixlib=rb-4.1.0&q=85" 
                className="w-full h-full object-cover opacity-20"
                alt="University Architecture"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-marketing-bg via-marketing-bg/80 to-marketing-bg" />
        </div>

        <motion.div 
            style={{ opacity, scale }}
            className="z-10 text-center max-w-4xl px-6"
        >
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-serif font-medium text-white mb-6 leading-tight"
            >
                Knowledge is <br/> <span className="text-marketing-primary italic">Limitless.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl font-mono text-marketing-fg/80 mb-10 max-w-2xl mx-auto"
            >
                A new era of digital learning. Explore world-class courses, master complex subjects, and shape your future.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-marketing-secondary text-white rounded-full text-lg font-mono hover:bg-marketing-secondary/90 transition-all">
                    Start Your Journey <CaretRight size={20} />
                </Link>
            </motion.div>
        </motion.div>
      </section>

      {/* Features Scrollytelling */}
      <FeatureSection 
        title="Expert Mentorship"
        desc="Learn directly from industry leaders and academic pioneers. Our instructors bring real-world experience to your screen."
        img="https://images.pexels.com/photos/8197553/pexels-photo-8197553.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        icon={<ChalkboardTeacher size={32} className="text-marketing-primary" />}
        align="left"
      />
      
      <FeatureSection 
        title="Collaborative Growth"
        desc="Join a community of ambitious learners. Share notes, discuss ideas, and grow together in a thriving ecosystem."
        img="https://images.unsplash.com/photo-1741699427799-3fbb70fce948?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMGNvbGxhYm9yYXRpbmclMjBsYXB0b3AlMjBsaWJyYXJ5fGVufDB8fHx8MTc3MTc0MDU5MXww&ixlib=rb-4.1.0&q=85"
        icon={<Users size={32} className="text-marketing-accent" />}
        align="right"
      />

      <FeatureSection 
        title="AI-Powered Insights"
        desc="Smart recommendations and progress tracking help you stay on top of your learning goals."
        img="https://images.pexels.com/photos/17483870/pexels-photo-17483870.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        icon={<Brain size={32} className="text-pink-500" />}
        align="left"
      />

      {/* CTA Footer */}
      <section className="py-32 px-6 bg-marketing-surface relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl font-serif text-white mb-8">Ready to redefine your future?</h2>
            <Link to="/register" className="inline-block px-12 py-5 bg-marketing-primary text-black text-xl font-bold rounded-full hover:scale-105 transition-transform">
                Get Started for Free
            </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureSection = ({ title, desc, img, icon, align }) => {
    return (
        <section className="min-h-screen flex items-center justify-center py-20 px-6">
            <div className={`max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center ${align === 'right' ? 'direction-rtl' : ''}`}>
                <motion.div 
                    initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`${align === 'right' ? 'md:order-2' : ''}`}
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit">{icon}</div>
                        <h2 className="text-4xl font-serif text-white mb-6">{title}</h2>
                        <p className="text-lg font-mono text-marketing-fg/70 leading-relaxed">{desc}</p>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`${align === 'right' ? 'md:order-1' : ''}`}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-marketing-primary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 blur-xl" />
                        <img src={img} alt={title} className="relative rounded-3xl shadow-2xl border border-white/10 w-full h-[400px] object-cover" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default LandingPage;
