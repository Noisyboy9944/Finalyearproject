import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookBookmark, GraduationCap, Clock } from '@phosphor-icons/react';

const Dashboard = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const API_URL = process.env.REACT_APP_BACKEND_URL;
                const res = await axios.get(`${API_URL}/api/programs`);
                setPrograms(res.data);
            } catch (err) {
                console.error("Failed to fetch programs");
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    if (loading) return <div className="text-center py-20 text-lms-muted">Loading your courses...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-sans font-bold text-lms-fg mb-2">My Programs</h1>
                <p className="text-lms-muted">Continue where you left off or explore new degrees.</p>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hero Stat Card */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-lms-primary to-lms-accent rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif mb-4">Weekly Progress</h3>
                        <div className="flex items-end gap-4 mb-2">
                            <span className="text-5xl font-bold font-mono">85%</span>
                            <span className="mb-2 text-white/80">Goal Reached</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2 mt-4">
                            <div className="bg-lms-secondary h-2 rounded-full w-[85%]" />
                        </div>
                    </div>
                    <GraduationCap size={200} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
                </div>

                {/* Quick Action */}
                <div className="bg-white border border-lms-secondary rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <Clock size={24} weight="fill" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Study Streak</h4>
                    <p className="text-3xl font-mono font-bold text-lms-fg">12 Days</p>
                </div>

                {/* Program List */}
                {programs.map((program) => (
                    <Link 
                        to={`/app/program/${program.id}`} 
                        key={program.id}
                        className="group bg-white border border-lms-secondary rounded-2xl p-0 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="h-40 overflow-hidden relative">
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                            <img src={program.image_url} alt={program.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-sans font-bold text-lg text-lms-fg line-clamp-2">{program.title}</h3>
                            </div>
                            <p className="text-sm text-lms-muted line-clamp-3 mb-4">{program.description}</p>
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-lms-primary group-hover:underline">
                                View Subjects <BookBookmark />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
