import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Swords, Trophy, User, Shield, 
  DollarSign, Hexagon, Settings, ChevronRight, LogOut, Loader2
} from 'lucide-react';
import { useQuestStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/components/auth/ProtectedAdminRoute';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Terminal', path: '/dashboard', icon: LayoutDashboard, description: 'Browse quests' },
  { label: 'My Quests', path: '/my-quests', icon: Swords, description: 'Active missions' },
  { label: 'Transactions', path: '/transactions', icon: DollarSign, description: 'Payment history' },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy, description: 'Rankings' },
  { label: 'Profile', path: '/profile', icon: User, description: 'Your stats' },
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
    <aside className="w-64 shrink-0 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Logo Area */}
      <div className="p-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hexagon className="w-5 h-5 text-primary" fill="currentColor" />
            <span className="font-cyber text-xs font-bold text-primary tracking-wider">KWESTLY</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">Mission Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative overflow-hidden ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
              )}
              
              <div className={`p-1.5 rounded ${
                active ? 'bg-primary/20' : 'bg-secondary'
              }`}>
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 text-left">
                <p className="font-mono text-sm font-medium">{item.label}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{item.description}</p>
              </div>
              
              {item.path === '/my-quests' && activeCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">
                  {activeCount}
                </span>
              )}
              
              <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-primary' : ''} ${
                active ? 'translate-x-1' : ''
              }`} />
            </motion.button>
          );
        })}

        {/* Admin Section */}
        {userIsAdmin && (
          <div className="pt-4 mt-4 border-t border-border/30">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Admin
            </p>
            
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative overflow-hidden ${
                location.pathname === '/admin'
                  ? 'bg-accent-purple/10 text-accent-purple'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {location.pathname === '/admin' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-purple rounded-r" />
              )}
              
              <div className={`p-1.5 rounded ${
                location.pathname === '/admin' ? 'bg-accent-purple/20' : 'bg-secondary'
              }`}>
                <Shield className="w-4 h-4" strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 text-left">
                <p className="font-mono text-sm font-medium">Admin Panel</p>
                <p className="font-mono text-[10px] text-muted-foreground">Manage platform</p>
              </div>
            </motion.button>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 space-y-1 border-t border-border/30">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
            location.pathname === '/settings'
              ? 'bg-white/5 text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-mono text-sm">Settings</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-kwestly-red/70 hover:text-kwestly-red hover:bg-kwestly-red/5 transition-all"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-mono text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
