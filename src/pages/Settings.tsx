import { FC, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Wallet, Bell, Shield, ExternalLink, Check, Loader2, 
  AlertCircle, Trash2, Key, Globe, BellRing, Eye, EyeOff,
  ChevronRight, Copy, CheckCircle, RefreshCw, Unlink
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthToken } from '@/hooks/useAuth';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: string[] }) => Promise<string[]>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: Shield },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'security', label: 'Security', icon: Key },
  { id: 'notifications', label: 'Alerts', icon: Bell },
];

const Settings: FC = () => {
  const { user } = useAuth();
  const { getToken } = useAuthToken();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="font-mono text-sm text-muted-foreground mb-8">
              Manage your account, wallet, and preferences
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Settings Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 shrink-0"
            >
              <div className="glass-card p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-sm transition-all rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </div>
            </motion.nav>

            {/* Settings Content */}
            <div className="flex-1 max-w-3xl">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && <ProfileSettings key="profile" />}
                {activeTab === 'wallet' && <WalletSettings key="wallet" />}
                {activeTab === 'security' && <SecuritySettings key="security" />}
                {activeTab === 'notifications' && <NotificationSettings key="notifications" />}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function ProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    github_username: user?.github_username || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        github_username: user.github_username || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('Profile updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <SectionHeader title="Profile Settings" description="Manage your public profile information" />

      <div className="glass-card p-6 space-y-6">
        <FormField label="Display Name" description="This is how you'll appear to others">
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full glass-input px-4 py-3 font-mono text-sm text-foreground rounded-lg"
            placeholder="Your name"
          />
        </FormField>

        <FormField label="GitHub Username" description="Used to calculate your Execution Score">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">@</span>
              <input
                type="text"
                value={profile.github_username}
                onChange={e => setProfile({ ...profile, github_username: e.target.value })}
                className="w-full glass-input pl-8 pr-4 py-3 font-mono text-sm text-foreground rounded-lg"
                placeholder="github_username"
              />
            </div>
            {profile.github_username && (
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 glass-button rounded-lg flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View</span>
              </a>
            )}
          </div>
        </FormField>

        <FormField label="Email" description="Your verified email address">
          <div className="flex items-center gap-3">
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="flex-1 glass-input px-4 py-3 font-mono text-sm text-muted-foreground rounded-lg"
            />
            <CheckCircle className="w-5 h-5 text-kwestly-green" />
          </div>
        </FormField>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function WalletSettings() {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState(user?.wallet_address || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [walletType, setWalletType] = useState<'metamask' | 'coinbase' | null>(null);

  const isMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask;

  const connectWallet = useCallback(async (type: 'metamask' | 'coinbase') => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask or Coinbase Wallet');
      return;
    }

    setIsConnecting(true);
    setWalletType(type);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Connection rejected');
      } else {
        toast.error('Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
      setWalletType(null);
    }
  }, []);

  const disconnectWallet = () => {
    setWalletAddress('');
    toast.success('Wallet disconnected');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied!');
  };

  const formatAddress = (address: string) => {
    if (showAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <SectionHeader 
        title="Wallet Connection" 
        description="Connect your wallet to receive payments in USDC" 
      />

      <div className="glass-card p-6 space-y-6">
        {/* Current Wallet Status */}
        {walletAddress ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-kwestly-green">
              <div className="w-3 h-3 bg-kwestly-green rounded-full animate-pulse" />
              <span className="font-mono text-sm font-bold">Wallet Connected</span>
            </div>

            <div className="glass p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-sm text-foreground font-bold">{formatAddress(walletAddress)}</p>
                  <p className="font-mono text-xs text-muted-foreground">Base Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="p-2 glass-button rounded-lg"
                >
                  {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyAddress}
                  className="p-2 glass-button rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={disconnectWallet}
                  className="p-2 glass-button rounded-lg text-kwestly-red hover:bg-kwestly-red/10"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <a
              href={`https://basescan.org/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
            >
              View on BaseScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="font-mono text-sm">No wallet connected</span>
            </div>
          </div>
        )}

        {/* Connect Wallet Options */}
        {!walletAddress && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WalletOption
              name="MetaMask"
              icon="🦊"
              description="Connect using MetaMask"
              onClick={() => connectWallet('metamask')}
              loading={isConnecting && walletType === 'metamask'}
              disabled={!isMetaMask}
            />
            <WalletOption
              name="Coinbase Wallet"
              icon="💰"
              description="Connect using Coinbase"
              onClick={() => connectWallet('coinbase')}
              loading={isConnecting && walletType === 'coinbase'}
              disabled={false}
            />
          </div>
        )}

        {!walletAddress && !isMetaMask && (
          <div className="p-4 bg-kwestly-gold/10 border border-kwestly-gold/30 rounded-lg">
            <p className="font-mono text-xs text-kwestly-gold">
              MetaMask not detected. Please install it from{' '}
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">
                metamask.io
              </a>
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="font-mono text-xs text-muted-foreground">
            <strong className="text-primary">Note:</strong> Payments are sent in USDC on Base Sepolia (testnet). 
            Your wallet must support USDC tokens to receive payments.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function WalletOption({ name, icon, description, onClick, loading, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="glass-card p-4 flex items-center gap-4 hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <span className="text-3xl">{icon}</span>
      <div className="text-left">
        <p className="font-mono text-sm font-bold text-foreground">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{description}</p>
      </div>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin ml-auto text-primary" />
      ) : (
        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}

function SecuritySettings() {
  const { getToken } = useAuthToken();
  const [copied, setCopied] = useState(false);

  const copyApiKey = async () => {
    const token = await getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <SectionHeader 
        title="Security & API" 
        description="Manage your API access and security settings" 
      />

      <div className="glass-card p-6 space-y-6">
        <FormField 
          label="API Token" 
          description="Use this token to authenticate API requests"
        >
          <div className="flex gap-2">
            <input
              type="password"
              value="••••••••••••••••••••••••"
              disabled
              className="flex-1 glass-input px-4 py-3 font-mono text-sm rounded-lg"
            />
            <button
              onClick={copyApiKey}
              className="px-4 py-3 glass-button rounded-lg flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-kwestly-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </FormField>

        <div className="pt-4 border-t border-border/30">
          <h4 className="font-mono text-sm font-bold text-foreground mb-2">Active Sessions</h4>
          <p className="font-mono text-xs text-muted-foreground">
            You're currently signed in on this device.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    quest_updates: true,
    new_quests: true,
    payments: true,
    leaderboard: false,
    email_digest: false,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preferences updated');
  };

  const notificationOptions = [
    { key: 'quest_updates' as const, label: 'Quest Updates', desc: 'Get notified when quest status changes' },
    { key: 'new_quests' as const, label: 'New Quests', desc: 'Get notified about new matching quests' },
    { key: 'payments' as const, label: 'Payments', desc: 'Get notified when you receive payments' },
    { key: 'leaderboard' as const, label: 'Leaderboard', desc: 'Get notified when your rank changes' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <SectionHeader 
        title="Notification Preferences" 
        description="Choose how you want to be notified" 
      />

      <div className="glass-card p-6 space-y-4">
        {notificationOptions.map(option => (
          <div key={option.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
            <div>
              <p className="font-mono text-sm text-foreground font-bold">{option.label}</p>
              <p className="font-mono text-xs text-muted-foreground">{option.desc}</p>
            </div>
            <ToggleSwitch 
              enabled={notifications[option.key]} 
              onChange={() => toggle(option.key)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      <p className="font-mono text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function FormField({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </label>
      {description && (
        <p className="font-mono text-xs text-muted-foreground mb-2">{description}</p>
      )}
      {children}
    </div>
  );
}

export default Settings;
