import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, CaretRight } from '@phosphor-icons/react';

const ProgramView = () => {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.REACT_APP_BACKEND_URL;
                const [progRes, subRes] = await Promise.all([
                    axios.get(`${API_URL}/api/programs/${programId}`),
                    axios.get(`${API_URL}/api/programs/${programId}/subjects`)
                ]);
                setProgram(progRes.data);
                setSubjects(subRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [programId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto">
             <Link to="/app" className="inline-flex items-center gap-2 text-lms-muted hover:text-lms-fg mb-6 text-sm">
                <ArrowLeft /> Back to Dashboard
            </Link>

            <div className="bg-white border border-lms-secondary rounded-2xl p-8 mb-8 shadow-sm">
                <h1 className="text-3xl font-serif font-bold text-lms-fg mb-2">{program.title}</h1>
                <p className="text-lms-muted max-w-3xl">{program.description}</p>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-lms-primary" />
                Available Subjects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map(subject => (
                    <Link 
                        to={`/app/subject/${subject.id}`}
                        key={subject.id}
                        className="bg-white border border-lms-secondary rounded-xl p-6 hover:border-lms-primary/50 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-lms-fg mb-2 group-hover:text-lms-primary transition-colors">{subject.title}</h3>
                                <p className="text-sm text-lms-muted">{subject.description}</p>
                            </div>
                            <CaretRight className="text-lms-muted group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProgramView;
