import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube';
import { ArrowLeft, CheckCircle, Play } from '@phosphor-icons/react';
import clsx from 'clsx';

const VideoPlayer = () => {
    const { unitId, videoId } = useParams();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.REACT_APP_BACKEND_URL;
                // Fetch video details, playlist (videos in unit), and unit details
                const [videoRes, playlistRes, unitRes] = await Promise.all([
                    axios.get(`${API_URL}/api/videos/${videoId}`),
                    axios.get(`${API_URL}/api/units/${unitId}/videos`),
                    axios.get(`${API_URL}/api/units/${unitId}`)
                ]);

                setCurrentVideo(videoRes.data);
                setPlaylist(playlistRes.data);
                setUnit(unitRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [unitId, videoId]);

    if (loading) return <div>Loading Player...</div>;

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6">
            {/* Main Player Section */}
            <div className="flex-1 flex flex-col">
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

            {/* Playlist Sidebar */}
            <div className="w-full lg:w-96 bg-white border border-lms-secondary rounded-2xl flex flex-col overflow-hidden h-fit max-h-full">
                <div className="p-4 bg-slate-50 border-b border-lms-secondary">
                    <h3 className="font-bold text-lms-fg">Unit Playlist</h3>
                    <p className="text-xs text-lms-muted truncate">{unit.title}</p>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar p-2 space-y-1">
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
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
