import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Code2, Wallet, Zap, Shield, Users, DollarSign, Star, ArrowRight, Twitter, Github as GithubIcon, Linkedin, Menu, X, Clock, CheckCircle, TrendingUp, Hexagon, ChevronDown, Play, Zap as ZapIcon, Lock, Eye, Award, BarChart3, Send } from 'lucide-react';
import QuestCard from '@/components/quest/QuestCard';
import { questService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { transformQuest } from '@/stores/appStore';
import type { Quest } from '@/types';

const Landing: FC = () => {
  const navigate = useNavigate();
  const { loginWithGithub, isAuthenticated } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    loadQuests();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  const loadQuests = async () => {
    try {
      const data = await questService.getOpenQuests();
      setQuests(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoggingIn(true);
      loginWithGithub();
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoggingIn(false);
    }
  };

  const displayQuests = quests.map(transformQuest);

  const stats = [
    { value: '2,847', label: 'Quests Completed' },
    { value: '$847K', label: 'Paid Out', color: 'text-kwestly-green' },
    { value: '8.2K', label: 'Developers', color: 'text-kwestly-purple' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'No waiting for payroll cycles. Get paid in USDC the moment your work is approved and verified.',
      color: 'cyan',
    },
    {
      icon: Shield,
      title: 'Escrow Protected',
      description: 'Funds are locked in smart contracts until you deliver. Zero risk of non-payment or disputes.',
      color: 'purple',
    },
    {
      icon: Users,
      title: 'Skill-Based Matching',
      description: 'Our Execution Score matches you with quests that fit your expertise. No more irrelevant offers.',
      color: 'green',
    },
    {
      icon: BarChart3,
      title: 'Transparent Market',
      description: 'See difficulty ratings, time limits, and bounty amounts upfront. No hidden fees or surprises.',
      color: 'gold',
    },
    {
      icon: Lock,
      title: 'Decentralized Trust',
      description: 'Built on Base blockchain. Your reputation and transaction history are immutable and verifiable.',
      color: 'cyan',
    },
    {
      icon: Award,
      title: 'Execution Score',
      description: 'Your GitHub activity creates a real-world skill profile. Higher score = access to better quests.',
      color: 'purple',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Connect Your Identity',
      description: 'Sign in with GitHub. We analyze your commit history, PR activity, and repository contributions to calculate your unique Execution Score.',
      icon: Github,
    },
    {
      number: '02',
      title: 'Browse & Accept Quests',
      description: 'Explore open quests filtered by difficulty, bounty, and required skills. Accept any quest that matches your expertise.',
      icon: Eye,
    },
    {
      number: '03',
      title: 'Ship Your Work',
      description: 'Complete the quest requirements. Submit your PR or deliverable before the time limit expires.',
      icon: Send,
    },
    {
      number: '04',
      title: 'Get Paid Instantly',
      description: 'Once approved, payment releases from escrow directly to your wallet in USDC. No middlemen.',
      icon: DollarSign,
    },
  ];

  const testimonials = [
    {
      quote: 'I paid off my student loans in 3 months using Kwestly. The gigs are real and pay fast.',
      author: 'Sarah Chen',
      role: 'Full-Stack Developer',
      avatar: 'SC',
    },
    {
      quote: 'Finally, a platform that values execution over credentials. My GitHub speaks for itself.',
      author: 'Marcus Johnson',
      role: 'Open Source Contributor',
      avatar: 'MJ',
    },
    {
      quote: 'The escrow system gives me peace of mind. I know I\'ll get paid for my work.',
      author: 'Emily Rodriguez',
      role: 'Freelance Developer',
      avatar: 'ER',
    },
  ];

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply connect your GitHub account. We\'ll analyze your activity to calculate your Execution Score, then you can start browsing and accepting quests immediately.',
    },
    {
      question: 'What is the Execution Score?',
      answer: 'Your Execution Score is calculated from your GitHub activity—commits, PRs, reviews, and repository contributions. It reflects your real-world coding ability and consistency.',
    },
    {
      question: 'How do payments work?',
      answer: 'When you accept a quest, the bounty is locked in escrow. Once you submit your work and it\'s approved, payment releases instantly to your connected wallet in USDC.',
    },
    {
      question: 'What\'s the platform fee?',
      answer: 'A flat 10% fee on successful payments. No subscription, no hidden charges, no fees on failed or disputed transactions.',
    },
    {
      question: 'Can I post my own quests?',
      answer: 'Yes! Anyone can post quests. Simply fund the escrow with the bounty amount, set requirements and time limit, and wait for a developer to accept.',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Hexagon className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="font-display text-xl font-bold text-foreground">KWESTLY</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
            <button onClick={() => document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Quests</button>
            <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLogin} disabled={loggingIn} className="glass-button px-5 py-2.5 font-mono text-sm font-bold text-foreground flex items-center gap-2">
              {loggingIn ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Github className="w-4 h-4" /></motion.div> : <Github className="w-4 h-4" />}
              Connect GitHub
            </button>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-nav mt-3 mx-6 rounded-lg overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left font-mono text-sm text-muted-foreground hover:text-foreground">Features</button>
                <button onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left font-mono text-sm text-muted-foreground hover:text-foreground">How It Works</button>
                <button onClick={() => { document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left font-mono text-sm text-muted-foreground hover:text-foreground">Quests</button>
                <button onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left font-mono text-sm text-muted-foreground hover:text-foreground">FAQ</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px]"
          />
        </div>

        <motion.div style={{ opacity, scale }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="font-mono text-xs text-foreground">Powered by USDC on Base Chain</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Ship Code.</span>
            <br />
            <span className="gradient-text">Get Paid.</span>
            <br />
            <span className="text-muted-foreground">No Bullshit.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The first P2P Side Quest platform where developers earn by shipping real code. 
            No resumes. No interviews. Just execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px hsl(182 100% 50% / 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loggingIn}
              className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg border-2 border-primary glow-cyan-strong flex items-center gap-3"
            >
              {loggingIn ? <Github className="w-6 h-6 animate-pulse" /> : <Github className="w-6 h-6" />}
              Start Earning Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card px-8 py-4 font-mono font-bold text-lg text-foreground flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`font-display text-3xl md:text-4xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
                <p className="font-mono text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
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
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="gradient-text">Kwestly</span>?
            </h2>
            <p className="font-mono text-muted-foreground max-w-xl mx-auto">
              Built for developers who value their time and skills. No bureaucracy, just results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  feature.color === 'cyan' ? 'bg-primary/20 text-primary' :
                  feature.color === 'purple' ? 'bg-accent-purple/20 text-accent-purple' :
                  feature.color === 'green' ? 'bg-accent-green/20 text-accent-green' :
                  'bg-accent-gold/20 text-accent-gold'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Four Steps to <span className="gradient-text">Getting Paid</span>
            </h2>
            <p className="font-mono text-muted-foreground max-w-xl mx-auto">
              From signup to payment in minutes. No lengthy onboarding, no complicated processes.
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
                <div className="glass-card p-6 h-full">
                  <div className="font-display text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    i % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-accent-purple/20 text-accent-purple'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Quests */}
      <section id="quests" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                Live <span className="gradient-text">Quests</span>
              </h2>
              <p className="font-mono text-muted-foreground">
                Real quests posted by real clients. Start earning today.
              </p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="hidden md:flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors">
              View All Quests <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <ZapIcon className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          ) : displayQuests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayQuests.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <QuestCard quest={quest} index={i} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card text-center py-20">
              <Hexagon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-muted-foreground">No open quests yet. Be the first to post one!</p>
              <button onClick={() => navigate('/dashboard')} className="mt-4 glass-button px-6 py-3 font-mono text-sm font-bold">
                Go to Dashboard
              </button>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors mx-auto">
              View All Quests <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Developers <span className="gradient-text">Say</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="font-mono text-sm text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono text-sm text-primary font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">{testimonial.author}</p>
                    <p className="font-mono text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px]"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ready to Ship?
            </h2>
            <p className="font-mono text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of developers earning on Kwestly. Your next gig is one click away.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 60px hsl(182 100% 50% / 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loggingIn}
              className="px-10 py-5 bg-primary text-primary-foreground font-mono font-bold text-xl border-2 border-primary glow-cyan-strong flex items-center gap-3 mx-auto"
            >
              {loggingIn ? <Github className="w-6 h-6 animate-pulse" /> : <Github className="w-6 h-6" />}
              Start Earning Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hexagon className="w-8 h-8 text-primary" fill="currentColor" />
                <span className="font-display text-xl font-bold text-foreground">KWESTLY</span>
              </div>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                The P2P Side Quest platform for developers who ship. No resumes. No interviews. Just execution.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Platform</h4>
              <div className="space-y-2">
                <button onClick={() => navigate('/dashboard')} className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Quests</button>
                <button onClick={() => navigate('/leaderboard')} className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Leaderboard</button>
                <button onClick={() => navigate('/terms')} className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Legal</h4>
              <div className="space-y-2">
                <button onClick={() => navigate('/privacy')} className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
                <button onClick={() => navigate('/terms')} className="block font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">© 2024 Kwestly, Inc. All rights reserved.</p>
            <p className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Secured by Base Blockchain • Payments in USDC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
