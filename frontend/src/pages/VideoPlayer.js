import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { ArrowLeft, CheckCircle, Play, NotePencil, VideoCamera } from '@phosphor-icons/react';
import clsx from 'clsx';

const VideoPlayer = () => {
    const { unitId, videoId } = useParams();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [unit, setUnit] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('playlist');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.REACT_APP_BACKEND_URL;
                const [videoRes, playlistRes, unitRes, notesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/videos/${videoId}`),
                    axios.get(`${API_URL}/api/units/${unitId}/videos`),
                    axios.get(`${API_URL}/api/units/${unitId}`),
                    axios.get(`${API_URL}/api/units/${unitId}/notes`)
                ]);

                setCurrentVideo(videoRes.data);
                setPlaylist(playlistRes.data);
                setUnit(unitRes.data);
                setNotes(notesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [unitId, videoId]);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lms-primary"></div>
        </div>
    );

    // Simple markdown renderer for notes
    const renderMarkdown = (text) => {
        if (!text) return null;
        let html = text;
        html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-lms-fg mt-6 mb-2">$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-lms-fg mt-6 mb-3">$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-lms-fg mt-6 mb-3">$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-slate-900 text-green-300 rounded-xl p-4 my-4 text-sm overflow-x-auto font-mono leading-relaxed"><code>$2</code></pre>');
        html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-lms-muted mb-1">$1</li>');
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-lms-muted mb-1">$1</li>');
        html = html.replace(/\n/g, '<br/>');
        return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6">
            {/* Main Player Section */}
            <div className="flex-1 flex flex-col min-w-0">
                <Link to={`/app/subject/${unit.subject_id}`} className="inline-flex items-center gap-2 text-lms-muted hover:text-lms-fg mb-4 text-sm">
                    <ArrowLeft /> Back to Unit
                </Link>

                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full relative mb-6">
                    <ReactPlayer 
                        url={currentVideo.url} 
                        width="100%" 
                        height="100%" 
                        controls
                        playing
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-serif font-bold text-lms-fg mb-2">{currentVideo.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-lms-muted font-mono">
                        <span>{currentVideo.instructor}</span>
                        <span>•</span>
                        <span>{currentVideo.duration}</span>
                    </div>
                </div>
            </div>

            {/* Sidebar with Tabs */}
            <div className="w-full lg:w-96 bg-white border border-lms-secondary rounded-2xl flex flex-col overflow-hidden h-fit max-h-[calc(100vh-100px)]">
                {/* Tab Headers */}
                <div className="flex border-b border-lms-secondary bg-slate-50 shrink-0">
                    <button
                        onClick={() => setActiveTab('playlist')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === 'playlist' 
                                ? "text-lms-primary border-b-2 border-lms-primary bg-white" 
                                : "text-lms-muted hover:text-lms-fg"
                        )}
                    >
                        <VideoCamera size={16} /> Playlist
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === 'notes' 
                                ? "text-lms-primary border-b-2 border-lms-primary bg-white" 
                                : "text-lms-muted hover:text-lms-fg"
                        )}
                    >
                        <NotePencil size={16} /> Notes {notes.length > 0 && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 rounded-full">{notes.length}</span>}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto flex-1">
                    {activeTab === 'playlist' && (
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2">
                                <p className="text-xs text-lms-muted font-mono truncate">{unit.title}</p>
                            </div>
                            {playlist.map((video) => {
                                const isActive = video.id === currentVideo.id;
                                return (
                                    <Link 
                                        key={video.id}
                                        to={`/app/unit/${unitId}/video/${video.id}`}
                                        className={clsx(
                                            "flex items-start gap-3 p-3 rounded-lg transition-colors",
                                            isActive ? "bg-lms-primary/10 border border-lms-primary/20" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                            isActive ? "bg-lms-primary text-white" : "bg-slate-200 text-slate-500"
                                        )}>
                                            {isActive ? <Play size={12} weight="fill" /> : <span className="text-xs font-mono">{video.order}</span>}
                                        </div>
                                        <div>
                                            <h4 className={clsx("text-sm font-medium leading-tight mb-1", isActive ? "text-lms-primary" : "text-lms-fg")}>
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-lms-muted">{video.duration}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="p-4">
                            {notes.length > 0 ? (
                                <div className="space-y-6">
                                    {notes.map(note => (
                                        <div key={note.id}>
                                            {renderMarkdown(note.content)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <NotePencil size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-sm text-lms-muted">No notes available for this unit yet.</p>
                                    <p className="text-xs text-gray-400 mt-1">Try the AI chatbot for explanations!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
