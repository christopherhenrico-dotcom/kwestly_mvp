import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, Settings, Hexagon, Menu, X } from 'lucide-react';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useQuestStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav: FC = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useQuestStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = user?.name || user?.github_username || user?.email?.split('@')[0] || 'User';

  return (
    <header className="h-16 glass-nav flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-50">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer shrink-0" 
        onClick={() => navigate('/')}
      >
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <Hexagon className="w-8 h-8 text-primary" fill="currentColor" />
        </motion.div>
        <span className="font-cyber text-lg font-bold text-foreground hidden md:block tracking-wider">
          KWESTLY
        </span>
      </div>

      {/* Search - Desktop */}
      {isDashboard && (
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-11 pr-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex-1 md:hidden" />

      {/* Right Section */}
      {user && (
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Search Toggle */}
          {isDashboard && (
            <button className="md:hidden p-2 glass-button rounded-lg">
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 glass-button rounded-lg"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-kwestly-red rounded-full text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Stats - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="glass-card px-3 py-1.5 flex items-center gap-2">
              <span className="font-mono text-sm text-kwestly-green font-bold">${user.total_earned || 0}</span>
              <span className="font-mono text-[10px] text-muted-foreground">USDC</span>
            </div>
            <ExecutionScoreBadge score={user.execution_score || 0} size="small" />
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg hover:border-primary/30 transition-all">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="font-mono text-xs text-primary font-bold">
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="hidden xl:block font-mono text-sm text-foreground max-w-[100px] truncate">
                {displayName}
              </span>
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center gap-3 px-3 py-2 font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 font-mono text-sm text-kwestly-red hover:bg-kwestly-red/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 glass-button rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}
    </header>
  );
};

export default TopNav;
