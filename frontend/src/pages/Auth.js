import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

const Auth = ({ type }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
        const API_URL = process.env.REACT_APP_BACKEND_URL;

        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', res.data.user_name);
            toast.success(`Welcome, ${res.data.user_name}!`);
            
            // Seed data automatically on first login if it's a new environment
            try { await axios.post(`${API_URL}/api/seed`); } catch(e) {}

            setTimeout(() => navigate('/app'), 1000);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-marketing-bg text-white relative overflow-hidden">
             <Toaster position="top-center" />
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-marketing-primary/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-marketing-secondary/10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative z-10 shadow-2xl">
                <h2 className="text-3xl font-serif text-center mb-8">
                    {type === 'login' ? 'Welcome Back' : 'Join UniLearnHub'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 font-mono">
                    {type === 'register' && (
                        <div>
                            <label className="block text-sm text-marketing-fg/60 mb-2">Full Name</label>
                            <input 
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-marketing-primary transition-colors"
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-marketing-fg/60 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-marketing-primary transition-colors"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-marketing-fg/60 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-marketing-primary transition-colors"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-marketing-primary text-black font-bold py-4 rounded-xl hover:bg-marketing-primary/90 transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-marketing-fg/60 font-mono">
                    {type === 'login' ? (
                        <p>Don't have an account? <Link to="/register" className="text-marketing-primary hover:underline">Register</Link></p>
                    ) : (
                        <p>Already have an account? <Link to="/login" className="text-marketing-primary hover:underline">Login</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
