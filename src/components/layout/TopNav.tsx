import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import ExecutionScoreBadge from '@/components/user/ExecutionScoreBadge';
import { useAuthStore } from '@/stores/appStore';
import { useQuestStore } from '@/stores/appStore';

const TopNav: FC = () => {
  const user = useAuthStore(s => s.user);
  const { searchQuery, setSearchQuery } = useQuestStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="font-display font-bold text-lg text-primary tracking-tighter">KWESTLY</span>
      </div>

      {/* Search */}
      {isDashboard && (
        <div className="flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-border pl-10 pr-4 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}

      <div className="flex-1" />

      {/* Right */}
      {user && (
        <div className="flex items-center gap-4">
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-kwestly-red rounded-full text-[8px] flex items-center justify-center font-mono">3</span>
          </button>

          <div className="font-mono text-sm text-kwestly-green">
            ${user.walletBalance} <span className="text-muted-foreground text-xs">USDC</span>
          </div>

          <ExecutionScoreBadge score={user.executionScore} size="small" />

          <span className="font-mono text-sm text-foreground">{user.username}</span>
        </div>
      )}
    </header>
  );
};

export default TopNav;
