import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Wallet, Github, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: string[] }) => Promise<string[]>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const steps = [
    {
      title: 'Welcome to Kwestly',
      description: 'The P2P Side Quest platform where developers earn by shipping code.',
      icon: Zap,
    },
    {
      title: 'Connect Your Wallet',
      description: 'Link your MetaMask or Coinbase Wallet to receive USDC payments instantly.',
      icon: Wallet,
      action: 'Connect Wallet',
    },
    {
      title: 'Link GitHub',
      description: 'Your Execution Score is calculated from your GitHub activity. Already linked!',
      icon: Github,
    },
    {
      title: "You're All Set!",
      description: 'Start browsing quests or post your first quest to start earning.',
      icon: Check,
      action: 'Go to Dashboard',
    },
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('Please install MetaMask or Coinbase Wallet to connect your wallet.');
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    onComplete();
    navigate('/dashboard');
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border p-8">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <motion.div
              key={step}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Icon className="w-8 h-8 text-primary" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-display text-2xl font-bold text-foreground mb-2"
              >
                {currentStep.title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-sm text-muted-foreground"
              >
                {currentStep.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              {walletAddress ? (
                <div className="bg-secondary border border-border p-3 font-mono text-xs text-foreground">
                  <span className="text-muted-foreground">Connected: </span>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full py-3 bg-primary text-primary-foreground font-mono font-bold border-2 border-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={step === 1 && !walletAddress}
                className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {step === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
