import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Code2, Wallet, Zap, Shield, Users, DollarSign, Star, ArrowRight, Twitter, Linkedin, Menu, X, Hexagon, ChevronDown, Play, Lock, Eye, Award, BarChart3, Send } from 'lucide-react';
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
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    loadQuests();
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

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
    { number: '01', title: 'Connect Your Identity', description: 'Sign in with GitHub, Google, or email. Your reputation starts here.', icon: Code2 },
    { number: '02', title: 'Browse & Accept Quests', description: 'Explore open quests filtered by difficulty, bounty, and required skills.', icon: Eye },
    { number: '03', title: 'Ship Your Work', description: 'Complete the quest requirements and submit your PR before the deadline.', icon: Send },
    { number: '04', title: 'Get Paid Instantly', description: 'Once approved, payment releases directly to your wallet in USDC.', icon: DollarSign },
  ];

  const features = [
    { icon: Zap, title: 'Instant Payments', description: 'No waiting for payroll. Get paid the moment your work is approved.', color: 'cyan' },
    { icon: Shield, title: 'Escrow Protected', description: 'Funds are locked until you deliver. Zero risk of non-payment.', color: 'purple' },
    { icon: Users, title: 'Skill-Based Matching', description: 'Your Execution Score matches you with quests that fit.', color: 'green' },
    { icon: BarChart3, title: 'Transparent Market', description: 'See difficulty, time limits, and bounties upfront.', color: 'gold' },
    { icon: Lock, title: 'Decentralized Trust', description: 'Built on Base blockchain. Your reputation is immutable.', color: 'cyan' },
    { icon: Award, title: 'Execution Score', description: 'Your GitHub activity creates a real-world skill profile.', color: 'purple' },
  ];

  const testimonials = [
    { quote: 'I paid off my student loans in 3 months using Kwestly. Real gigs, fast pay.', author: 'Sarah Chen', role: 'Full-Stack Dev', avatar: 'SC' },
    { quote: 'Finally, a platform that values execution over credentials. My GitHub speaks.', author: 'Marcus Johnson', role: 'OSS Contributor', avatar: 'MJ' },
    { quote: 'The escrow gives me peace of mind. I know I\'ll get paid for my work.', author: 'Emily Rodriguez', role: 'Freelance Dev', avatar: 'ER' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Hexagon className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="font-display text-xl font-bold text-foreground">KWESTLY</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground">Features</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground">How It Works</button>
            <button onClick={() => document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground">Quests</button>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/sign-in')} className="glass-button px-5 py-2.5 font-mono text-sm font-bold text-foreground flex items-center gap-2">
                <Github className="w-4 h-4" />
                Get Started
              </motion.button>
            </Show>
            <Show when="signed-in">
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/dashboard')} className="glass-button px-5 py-2.5 font-mono text-sm font-bold text-foreground">
                Dashboard
              </motion.button>
            </Show>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="font-mono text-xs text-foreground">Powered by USDC on Base Chain</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="text-foreground">Ship Code.</span><br />
            <span className="gradient-text">Get Paid.</span><br />
            <span className="text-muted-foreground">No Bullshit.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The first P2P Side Quest platform where developers earn by shipping real code. No resumes. No interviews. Just execution.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Show when="signed-out">
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 40px hsl(182 100% 50% / 0.4)' }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/sign-in')} className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg border-2 border-primary glow-cyan-strong flex items-center gap-3">
                <Github className="w-6 h-6" />
                Start Earning Now
              </motion.button>
            </Show>
            <Show when="signed-in">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg border-2 border-primary glow-cyan-strong flex items-center gap-3">
                Go to Dashboard
              </motion.button>
            </Show>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="glass-card px-8 py-4 font-mono font-bold text-lg text-foreground flex items-center gap-3">
              <Play className="w-5 h-5" />
              See How It Works
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
            {[{ value: '2,847', label: 'Quests Done' }, { value: '$847K', label: 'Paid Out', color: 'text-kwestly-green' }, { value: '8.2K', label: 'Developers', color: 'text-kwestly-purple' }].map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`font-display text-3xl md:text-4xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
                <p className="font-mono text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose <span className="gradient-text">Kwestly</span>?</h2>
            <p className="font-mono text-muted-foreground">Built for developers who value their time. No bureaucracy, just results.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 group hover:border-primary/30">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${f.color === 'cyan' ? 'bg-primary/20 text-primary' : f.color === 'purple' ? 'bg-accent-purple/20 text-accent-purple' : f.color === 'green' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-gold/20 text-accent-gold'}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-mono text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Four Steps to <span className="gradient-text">Getting Paid</span></h2>
            <p className="font-mono text-muted-foreground">From signup to payment in minutes.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
                <div className="glass-card p-6 h-full">
                  <div className="font-display text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-accent-purple/20 text-accent-purple'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="font-mono text-sm text-muted-foreground">{step.description}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="quests" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">Live <span className="gradient-text">Quests</span></h2>
              <p className="font-mono text-muted-foreground">Real quests from real clients. Start earning today.</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="hidden md:flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Zap className="w-8 h-8 text-primary" /></motion.div></div>
          ) : quests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quests.map((quest, i) => <QuestCard key={quest.id} quest={transformQuest(quest)} index={i} />)}
            </div>
          ) : (
            <div className="glass-card text-center py-20">
              <Hexagon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-muted-foreground">No open quests yet. Be the first to post one!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">What Developers <span className="gradient-text">Say</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent-gold" fill="currentColor" />)}</div>
                <p className="font-mono text-sm text-foreground mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono text-sm text-primary font-bold">{t.avatar}</div>
                  <div><p className="font-mono text-sm font-bold text-foreground">{t.author}</p><p className="font-mono text-xs text-muted-foreground">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">Ready to Ship?</h2>
            <p className="font-mono text-lg text-muted-foreground mb-10">Join thousands of developers earning on Kwestly.</p>
            <Show when="signed-out">
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 60px hsl(182 100% 50% / 0.5)' }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/sign-in')} className="px-10 py-5 bg-primary text-primary-foreground font-mono font-bold text-xl border-2 border-primary glow-cyan-strong flex items-center gap-3 mx-auto">
                <Github className="w-6 h-6" />
                Start Earning Now
              </motion.button>
            </Show>
          </motion.div>
        </div>
      </section>

      <footer className="py-16 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4"><Hexagon className="w-8 h-8 text-primary" fill="currentColor" /><span className="font-display text-xl font-bold text-foreground">KWESTLY</span></div>
              <p className="font-mono text-sm text-muted-foreground">The P2P Side Quest platform for developers who ship.</p>
            </div>
            <div><h4 className="font-display font-bold text-foreground mb-4">Platform</h4><div className="space-y-2">{['Browse Quests', 'Leaderboard', 'How It Works'].map(l => <button key={l} onClick={() => navigate('/dashboard')} className="block font-mono text-sm text-muted-foreground hover:text-foreground">{l}</button>)}</div></div>
            <div><h4 className="font-display font-bold text-foreground mb-4">Legal</h4><div className="space-y-2">{['Privacy Policy', 'Terms of Service'].map(l => <button key={l} onClick={() => navigate(l === 'Privacy Policy' ? '/privacy' : '/terms')} className="block font-mono text-sm text-muted-foreground hover:text-foreground">{l}</button>)}</div></div>
            <div><h4 className="font-display font-bold text-foreground mb-4">Connect</h4><div className="flex gap-3">{[{ icon: Twitter, href: 'https://twitter.com' }, { icon: Github, href: 'https://github.com' }, { icon: Linkedin, href: 'https://linkedin.com' }].map(({ icon: Icon, href }, i) => <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass-card flex items-center justify-center text-muted-foreground hover:text-foreground"><Icon className="w-5 h-5" /></a>)}</div></div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">© 2024 Kwestly, Inc.</p>
            <p className="font-mono text-xs text-muted-foreground flex items-center gap-2"><Lock className="w-3 h-3" />Secured by Base Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
