import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, Settings, Hexagon } from 'lucide-react';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useQuestStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';
import NotificationPanel from '@/components/notifications/NotificationPanel';

const TopNav: FC = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useQuestStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = user?.name || user?.github_username || user?.email?.split('@')[0] || 'User';

  return (
    <header className="h-14 glass-nav flex items-center px-4 gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <Hexagon className="w-7 h-7 text-primary" fill="currentColor" />
        <span className="font-display text-lg font-bold text-foreground hidden sm:block">KWESTLY</span>
      </div>

      {isDashboard && (
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors glass-button"
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-kwestly-red rounded-full" />
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-1.5">
            <span className="font-mono text-sm text-kwestly-green font-bold">${user.total_earned || 0}</span>
            <span className="font-mono text-xs text-muted-foreground">USDC</span>
          </div>

          <ExecutionScoreBadge score={user.execution_score || 0} size="small" />

          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div className="hidden sm:block">
            <span className="font-mono text-sm text-foreground">{displayName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-kwestly-red transition-colors"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </header>
  );
};

export default TopNav;
