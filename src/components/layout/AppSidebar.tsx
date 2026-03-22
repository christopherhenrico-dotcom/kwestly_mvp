import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Swords, Trophy, User, Shield, DollarSign, Hexagon } from 'lucide-react';
import { useQuestStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/components/auth/ProtectedAdminRoute';

const navItems = [
  { label: 'Terminal', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Quests', path: '/my-quests', icon: Swords },
  { label: 'Transactions', path: '/transactions', icon: DollarSign },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Profile', path: '/profile', icon: User },
];

const AppSidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCount = useQuestStore(s => s.activeQuests.length);
  const { userId, logout } = useAuth();
  const userIsAdmin = isAdmin(userId);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-56 glass shrink-0 min-h-[calc(100vh-3.5rem)] flex flex-col m-3 rounded-lg">
      <div className="flex items-center gap-2 p-4 border-b border-border/30">
        <Hexagon className="w-6 h-6 text-primary" fill="currentColor" />
        <span className="font-display text-sm font-bold text-foreground">MENU</span>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-mono transition-all duration-200 rounded-md ${
                active
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" strokeWidth={1.5} />
              <span>{item.label}</span>
              {item.path === '/my-quests' && activeCount > 0 && (
                <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded">
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}

        {userIsAdmin && (
          <div className="pt-3 mt-3 border-t border-border/30">
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-mono transition-all duration-200 rounded-md ${
                location.pathname === '/admin'
                  ? 'bg-accent-purple/15 text-accent-purple border border-accent-purple/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" strokeWidth={1.5} />
              <span>Admin Panel</span>
            </button>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-border/30">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5"
        >
          Settings
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
