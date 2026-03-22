import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Wallet, Bell, Shield, ExternalLink, Check, Loader2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const tabs = [
  { id: 'profile', label: 'Profile', icon: Shield },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Settings: FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    github_username: user?.github_username || '',
    avatar_url: user?.avatar_url || '',
  });

  const [wallet, setWallet] = useState({
    wallet_address: user?.wallet_address || '',
  });

  const [notifications, setNotifications] = useState({
    quest_updates: true,
    new_quests: true,
    payments: true,
    leaderboard: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        github_username: user.github_username || '',
        avatar_url: user.avatar_url || '',
      });
      setWallet({
        wallet_address: user.wallet_address || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask or Coinbase Wallet');
      return;
    }
    setIsConnectingWallet(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet({ wallet_address: address });
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            Settings
          </h1>

          <div className="flex gap-6">
            <div className="w-48 shrink-0">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 font-mono text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border border-primary'
                        : 'text-muted-foreground hover:text-foreground border border-transparent'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 max-w-2xl">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-card border border-border p-6">
                    <h2 className="font-display font-bold text-lg text-foreground mb-4">Profile Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={e => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="Your display name"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
                          GitHub Username
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profile.github_username}
                            onChange={e => setProfile({ ...profile, github_username: e.target.value })}
                            className="flex-1 bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="github_username"
                          />
                          <a
                            href={`https://github.com/${profile.github_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 border border-border text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          value={profile.avatar_url}
                          onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
                          className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="https://..."
                        />
                        {profile.avatar_url && (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar preview"
                            className="mt-2 w-16 h-16 rounded-full border border-border object-cover"
                          />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="mt-6 w-full py-3 bg-primary text-primary-foreground font-mono font-bold border-2 border-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wallet' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-card border border-border p-6">
                    <h2 className="font-display font-bold text-lg text-foreground mb-2">Wallet Connection</h2>
                    <p className="font-mono text-sm text-muted-foreground mb-6">
                      Connect your wallet to receive USDC payments for completed quests.
                    </p>

                    <div className="bg-secondary border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground mb-1">Connected Wallet</p>
                          {wallet.wallet_address ? (
                            <p className="font-mono text-sm text-foreground">
                              {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                            </p>
                          ) : (
                            <p className="font-mono text-sm text-muted-foreground">No wallet connected</p>
                          )}
                        </div>
                        <button
                          onClick={connectWallet}
                          disabled={isConnectingWallet}
                          className="px-4 py-2 bg-primary text-primary-foreground font-mono text-sm font-bold border-2 border-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isConnectingWallet ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : wallet.wallet_address ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Wallet className="w-4 h-4" />
                          )}
                          {wallet.wallet_address ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 p-4 border border-border bg-kwestly-gold/5">
                      <p className="font-mono text-xs text-kwestly-gold">
                        <strong>Note:</strong> Payments are sent in USDC on Base network. Make sure your wallet supports USDC.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-card border border-border p-6">
                    <h2 className="font-display font-bold text-lg text-foreground mb-2">Notification Preferences</h2>
                    <p className="font-mono text-sm text-muted-foreground mb-6">
                      Control what notifications you receive.
                    </p>

                    <div className="space-y-4">
                      {[
                        { key: 'quest_updates', label: 'Quest Updates', desc: 'Get notified when your quest status changes' },
                        { key: 'new_quests', label: 'New Quests', desc: 'Get notified about new quests matching your skills' },
                        { key: 'payments', label: 'Payments', desc: 'Get notified when you receive payments' },
                        { key: 'leaderboard', label: 'Leaderboard', desc: 'Get notified when your rank changes' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-mono text-sm text-foreground">{item.label}</p>
                            <p className="font-mono text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.key, !notifications[item.key as keyof typeof notifications])}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-border'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
