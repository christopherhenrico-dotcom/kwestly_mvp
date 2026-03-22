import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import pb from '@/services/pocketbase';

const GITHUB_CLIENT_ID = 'Ov23li5zdtI9iS8OfKDw';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

const Login: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = () => {
    setLoading(true);
    setError(null);

    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read:user,user:email&state=${state}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome to Kwestly</h1>
            <p className="font-mono text-sm text-muted-foreground">Connect with GitHub to start earning</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-kwestly-red/10 border border-kwestly-red/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-kwestly-red shrink-0" />
              <p className="font-mono text-sm text-kwestly-red">{error}</p>
            </motion.div>
          )}

          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full py-4 bg-[#24292e] hover:bg-[#2f363d] text-white font-mono font-bold text-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Github className="w-6 h-6" />
            )}
            Continue with GitHub
          </button>

          <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
