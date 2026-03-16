import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Swords, Trophy, User, Settings, LogOut, Shield } from 'lucide-react';
import { useQuestStore, useAuthStore } from '@/stores/appStore';

const navItems = [
  { label: 'Terminal', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Quests', path: '/my-quests', icon: Swords, badge: true },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Admin', path: '/admin', icon: Shield },
];

const AppSidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCount = useQuestStore(s => s.activeQuests.length);
  const logout = useAuthStore(s => s.logout);

  return (
    <aside className="w-56 border-r border-border bg-card min-h-[calc(100vh-3.5rem)] flex flex-col relative">
      {/* Gradient accent line */}
      <div className="absolute top-0 right-0 w-px h-full opacity-10"
        style={{ background: 'linear-gradient(to bottom, hsl(182 100% 50%), transparent)' }} />

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" strokeWidth={1.5} />
              <span>{item.label}</span>
              {item.badge && activeCount > 0 && (
                <span className="ml-auto bg-kwestly-cyan/20 text-kwestly-cyan text-xs font-bold px-1.5 py-0.5">
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono text-muted-foreground hover:text-kwestly-red transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
