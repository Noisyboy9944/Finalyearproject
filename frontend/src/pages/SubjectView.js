import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, PlayCircle } from '@phosphor-icons/react';

const SubjectView = () => {
    const { subjectId } = useParams();
    const [subject, setSubject] = useState(null);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.REACT_APP_BACKEND_URL;
                const [subjRes, unitsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/subjects/${subjectId}`),
                    axios.get(`${API_URL}/api/subjects/${subjectId}/units`)
                ]);
                
                // Fetch videos for each unit to get the first video link
                const unitsWithVideos = await Promise.all(unitsRes.data.map(async (unit) => {
                    const videoRes = await axios.get(`${API_URL}/api/units/${unit.id}/videos`);
                    return { ...unit, videos: videoRes.data };
                }));

                setSubject(subjRes.data);
                setUnits(unitsWithVideos);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
             <Link to={`/app/program/${subject.program_id}`} className="inline-flex items-center gap-2 text-lms-muted hover:text-lms-fg mb-6 text-sm">
                <ArrowLeft /> Back to Program
            </Link>

            <header className="mb-10">
                <h1 className="text-4xl font-serif font-bold text-lms-fg mb-4">{subject.title}</h1>
                <p className="text-lg text-lms-muted">{subject.description}</p>
            </header>

            <div className="space-y-6">
                {units.map((unit, index) => (
                    <div key={unit.id} className="bg-white border border-lms-secondary rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-6 py-4 border-b border-lms-secondary flex justify-between items-center">
                            <h3 className="font-bold text-lg text-lms-fg">Unit {unit.order}: {unit.title}</h3>
                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-lms-secondary text-lms-muted">{unit.videos.length} Videos</span>
                        </div>
                        <div className="divide-y divide-lms-secondary">
                            {unit.videos.map(video => (
                                <Link 
                                    to={`/app/unit/${unit.id}/video/${video.id}`}
                                    key={video.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-lms-primary/5 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-lms-primary/10 text-lms-primary flex items-center justify-center group-hover:bg-lms-primary group-hover:text-white transition-colors">
                                        <PlayCircle size={24} weight="fill" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-lms-fg">{video.title}</h4>
                                        <p className="text-xs text-lms-muted">{video.duration} • {video.instructor}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectView;
