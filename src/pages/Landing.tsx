import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Code2, Wallet, Zap, Loader2 } from 'lucide-react';
import QuestCard from '@/components/quest/QuestCard';
import { questService, authService } from '@/services';
import { useAuthStore, transformQuest } from '@/stores/appStore';
import type { Quest } from '@/types';

const Landing: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    loadQuests();
  }, []);

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
      await authService.loginWithGithub();
    } catch (err) {
      console.error('Login failed:', err);
      navigate('/dashboard');
    } finally {
      setLoggingIn(false);
    }
  };

  const displayQuests = quests.map(transformQuest);

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-6 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo_nobg.png" alt="Kwestly" className="h-8 w-auto" />
        </div>
        <button onClick={() => navigate('/dashboard')} className="font-mono text-sm text-primary hover:text-foreground transition-colors">
          LAUNCH APP →
        </button>
      </nav>

      <section className="py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-6">
            Ship Code.{' '}
            <span className="text-primary text-glow-cyan">Get Paid.</span>
            <br />No Bullshit.
          </h1>
          <p className="font-mono text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            The first P2P Side Quest platform. Earn $100 before lunch. No resumes. No interviews. Just execution.
          </p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={handleLogin} disabled={loggingIn} className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono font-bold text-lg border-2 border-primary glow-cyan-strong hover:bg-primary/90 transition-all disabled:opacity-50">
            {loggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : <Github className="w-6 h-6" strokeWidth={1.5} />}
            CONNECT GITHUB
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-16 flex justify-center gap-12 font-mono text-sm">
          <div><span className="text-2xl font-bold text-foreground">420</span><p className="text-muted-foreground mt-1">Quests Completed</p></div>
          <div className="border-l border-border" />
          <div><span className="text-2xl font-bold text-kwestly-green">$69K</span><p className="text-muted-foreground mt-1">Paid Out</p></div>
          <div className="border-l border-border" />
          <div><span className="text-2xl font-bold text-kwestly-purple">1.2K</span><p className="text-muted-foreground mt-1">Developers</p></div>
        </motion.div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tighter text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: Github, title: 'CONNECT', desc: 'Link your GitHub. We analyze your commits to calculate your Execution Score.' },{ icon: Code2, title: 'EXECUTE', desc: 'Grab a Quest. Ship the code. Submit your PR before the timer expires.' },{ icon: Wallet, title: 'CASH OUT', desc: 'Buyer approves. You get paid in USDC instantly. 10% flat fee.' }].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="border border-border bg-card p-6 text-center group hover:border-primary transition-all">
                <step.icon className="w-10 h-10 mx-auto mb-4 text-primary" strokeWidth={1.5} />
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tighter text-center mb-4 text-foreground">Live Quests</h2>
          <p className="font-mono text-sm text-muted-foreground text-center mb-10">Connect to accept</p>
          {loading ? <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : displayQuests.length > 0 ? <div className="grid md:grid-cols-3 gap-6">{displayQuests.map((quest, i) => <QuestCard key={quest.id} quest={quest} index={i} />)}</div> : <div className="text-center py-10 font-mono text-muted-foreground">No open quests available.</div>}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <img src="/logo_nobg.png" alt="Kwestly" className="h-6 w-auto" />
          <div className="flex gap-6 font-mono text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">Discord</a>
            <a href="#" className="hover:text-foreground">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;