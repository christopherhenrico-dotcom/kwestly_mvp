import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, Code2, Wallet, Zap, Shield, Users, DollarSign, 
  Star, ArrowRight, Twitter, Linkedin, Menu, X, Hexagon, 
  ChevronDown, Play, Lock, Eye, Award, BarChart3, Send,
  Rocket, Cpu, Fingerprint
} from 'lucide-react';
import { Show } from '@clerk/react';
import QuestCard from '@/components/quest/QuestCard';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { transformQuest } from '@/stores/appStore';

const Landing: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadQuests();
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadQuests = async () => {
    try {
      const data = await api.getQuests({ status: 'open' });
      setQuests(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { 
      number: '01', 
      title: 'Connect Your Identity', 
      description: 'Sign in instantly with GitHub, Google, or email. No passwords to remember.', 
      icon: Fingerprint,
      color: 'cyan'
    },
    { 
      number: '02', 
      title: 'Find Your Quest', 
      description: 'Browse missions by difficulty, bounty, or your Execution Score range.', 
      icon: Eye,
      color: 'purple'
    },
    { 
      number: '03', 
      title: 'Ship Real Code', 
      description: 'Submit your PR. Get reviewed. Get paid. Simple.', 
      icon: Rocket,
      color: 'green'
    },
    { 
      number: '04', 
      title: 'Watch the USDC Flow', 
      description: 'Funds release instantly to your wallet. No waiting for payroll.', 
      icon: DollarSign,
      color: 'gold'
    },
  ];

  const features = [
    { 
      icon: Zap, 
      title: 'Instant Settlements', 
      description: 'USDC hits your wallet the second your work gets approved. No payroll delays.', 
      color: 'cyan',
      glow: 'from-primary/20 to-primary/5'
    },
    { 
      icon: Shield, 
      title: 'Escrow Guarantee', 
      description: 'Bounties are locked in smart contracts. You WILL get paid.', 
      color: 'purple',
      glow: 'from-accent-purple/20 to-accent-purple/5'
    },
    { 
      icon: Award, 
      title: 'Execution Score', 
      description: 'Your GitHub activity = your reputation. Ship code, build score.', 
      color: 'green',
      glow: 'from-accent-green/20 to-accent-green/5'
    },
    { 
      icon: BarChart3, 
      title: 'Transparent Bounties', 
      description: 'Every quest shows difficulty, deadline, and exact payout upfront.', 
      color: 'gold',
      glow: 'from-accent-gold/20 to-accent-gold/5'
    },
    { 
      icon: Lock, 
      title: 'Unstoppable Platform', 
      description: 'Built on Base. Your reputation and earnings live on-chain.', 
      color: 'cyan',
      glow: 'from-primary/20 to-primary/5'
    },
    { 
      icon: Cpu, 
      title: 'Skill Matching', 
      description: 'Execution Score connects you with quests that match your abilities.', 
      color: 'purple',
      glow: 'from-accent-purple/20 to-accent-purple/5'
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [-100, window.innerHeight + 100], opacity: [0, 1, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-primary rounded-full left-1/4"
        />
        <motion.div 
          animate={{ y: [-100, window.innerHeight + 100], opacity: [0, 1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute w-1 h-1 bg-accent-purple rounded-full left-1/2"
        />
        <motion.div 
          animate={{ y: [-100, window.innerHeight + 100], opacity: [0, 1, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 10 }}
          className="absolute w-1 h-1 bg-kwestly-green rounded-full left-3/4"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/logo_nobg.png" 
              alt="Kwestly" 
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </NavLink>
            <NavLink onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </NavLink>
            <NavLink onClick={() => document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' })}>
              Quests
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/sign-in')} 
                className="glass-button px-5 py-2.5 font-mono text-sm font-bold text-foreground flex items-center gap-2 rounded-lg"
              >
                <Github className="w-4 h-4" />
                Launch App
              </motion.button>
            </Show>
            <Show when="signed-in">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')} 
                className="glass-button px-5 py-2.5 font-mono text-sm font-bold text-foreground rounded-lg"
              >
                Dashboard
              </motion.button>
            </Show>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 glass-button rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[150px]"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 rounded-full"
          >
            <motion.span 
              className="w-2 h-2 bg-kwestly-green rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-xs text-foreground">
              <span className="text-kwestly-green font-bold">$847K+</span> paid out to developers
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8"
          >
            <span className="text-foreground">Stop Waiting.</span>
            <br />
            <span className="gradient-text">Start Shipping.</span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">Get Paid.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The P2P Side Quest platform where your GitHub speaks louder than your resume. 
            Real code. Real money. Real simple.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Show when="signed-out">
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 0 50px hsl(182 100% 50% / 0.4)' }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/sign-in')} 
                className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg border-2 border-primary glow-cyan-strong flex items-center gap-3 rounded-lg"
              >
                <Rocket className="w-6 h-6" />
                Start Earning Now
              </motion.button>
            </Show>
            <Show when="signed-in">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')} 
                className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg border-2 border-primary glow-cyan-strong flex items-center gap-3 rounded-lg"
              >
                <Rocket className="w-6 h-6" />
                Go to Dashboard
              </motion.button>
            </Show>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card px-8 py-4 font-mono font-bold text-lg text-foreground flex items-center gap-3 rounded-lg"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { value: '2,847+', label: 'Quests Completed', color: 'text-primary' },
              { value: '$847K+', label: 'Paid to Devs', color: 'text-kwestly-green' },
              { value: '8,200+', label: 'Active Devs', color: 'text-accent-purple' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card p-6"
              >
                <p className={`font-cyber text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why <span className="gradient-text">Kwestly</span>?
            </h2>
            <p className="font-mono text-muted-foreground max-w-xl mx-auto">
              Built for developers who believe in execution over credentials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    f.color === 'cyan' ? 'bg-primary/20 text-primary' : 
                    f.color === 'purple' ? 'bg-accent-purple/20 text-accent-purple' : 
                    f.color === 'green' ? 'bg-accent-green/20 text-accent-green' : 
                    'bg-accent-gold/20 text-accent-gold'
                  }`}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">The Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              From <span className="gradient-text">Zero</span> to <span className="gradient-text">Paid</span>
            </h2>
            <p className="font-mono text-muted-foreground max-w-xl mx-auto">
              Four steps. No fluff. Just results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-6 h-full relative overflow-hidden">
                  {/* Step number */}
                  <div className={`font-cyber text-6xl font-bold mb-4 ${
                    step.color === 'cyan' ? 'text-primary/10' :
                    step.color === 'purple' ? 'text-accent-purple/10' :
                    step.color === 'green' ? 'text-accent-green/10' :
                    'text-accent-gold/10'
                  }`}>
                    {step.number}
                  </div>
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    step.color === 'cyan' ? 'bg-primary/20 text-primary' : 
                    step.color === 'purple' ? 'bg-accent-purple/20 text-accent-purple' : 
                    step.color === 'green' ? 'bg-accent-green/20 text-accent-green' : 
                    'bg-accent-gold/20 text-accent-gold'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Quests Preview */}
      <section id="quests" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Live Missions</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                Available <span className="gradient-text">Quests</span>
              </h2>
              <p className="font-mono text-muted-foreground">
                Pick your next mission. Any skill level.
              </p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All Quests <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-6 w-20 bg-primary/20 rounded mb-4" />
                  <div className="h-8 w-3/4 bg-primary/20 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-primary/10 rounded" />
                </div>
              ))}
            </div>
          ) : quests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quests.map((quest, i) => (
                <QuestCard key={quest.id} quest={transformQuest(quest)} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/logo_nobg.png" 
                  alt="Kwestly" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No Active Quests
              </h3>
              <p className="font-mono text-sm text-muted-foreground">
                Check back soon for new missions!
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors mx-auto"
            >
              View All Quests <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Next Mission <span className="gradient-text">Awaits</span>
            </h2>
            <p className="font-mono text-lg text-muted-foreground mb-10">
              Join thousands of developers already earning on Kwestly. Your skills are in demand.
            </p>
            <Show when="signed-out">
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 0 60px hsl(182 100% 50% / 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/sign-in')}
                className="px-10 py-5 bg-primary text-primary-foreground font-mono font-bold text-xl border-2 border-primary glow-cyan-strong flex items-center gap-3 mx-auto rounded-lg"
              >
                <Rocket className="w-6 h-6" />
                Launch Your Career
              </motion.button>
            </Show>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo_nobg.png" 
                  alt="Kwestly" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                The P2P Side Quest platform for developers who ship.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Platform</h4>
              <div className="space-y-2">
                {['Browse Quests', 'Leaderboard', 'How It Works'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => navigate('/dashboard')} 
                    className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Legal</h4>
              <div className="space-y-2">
                {['Privacy Policy', 'Terms of Service'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => navigate(l === 'Privacy Policy' ? '/privacy' : '/terms')}
                    className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Connect</h4>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: 'https://twitter.com' },
                  { icon: Github, href: 'https://github.com' },
                  { icon: Linkedin, href: 'https://linkedin.com' }
                ].map(({ icon: Icon, href }, i) => (
                  <a 
                    key={i} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 Kwestly, Inc. All rights reserved.
            </p>
            <p className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Secured by Base Blockchain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function NavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
    </button>
  );
}

export default Landing;
