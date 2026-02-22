import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { House, Books, SignOut, User } from '@phosphor-icons/react';

const Layout = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user') || 'Student';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-lms-bg font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 fixed h-full bg-white border-r border-lms-secondary flex flex-col z-20">
                <div className="p-6 border-b border-lms-secondary">
                    <h1 className="text-xl font-serif font-bold text-lms-primary">UniLearnHub</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/app" icon={<House size={20} />} label="Dashboard" end />
                    {/* Add more items later if needed */}
                </nav>

                <div className="p-4 border-t border-lms-secondary">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-lms-secondary/30">
                        <div className="w-8 h-8 rounded-full bg-lms-primary text-white flex items-center justify-center font-bold">
                            {user[0]}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-lms-fg truncate">{user}</p>
                            <p className="text-xs text-lms-muted">Student</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <SignOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, end }) => (
    <NavLink 
        to={to} 
        end={end}
        className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                ? 'bg-lms-primary text-white shadow-md shadow-lms-primary/20' 
                : 'text-lms-fg hover:bg-lms-secondary'
            }`
        }
    >
        {icon}
        {label}
    </NavLink>
);

export default Layout;
