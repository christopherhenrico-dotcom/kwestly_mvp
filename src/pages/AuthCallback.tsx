import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import pb from '@/services/pocketbase';

const GITHUB_CLIENT_ID = 'Ov23li5zdtI9iS8OfKDw';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage(error);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const savedState = sessionStorage.getItem('oauth_state');
      if (state && savedState && state !== savedState) {
        setStatus('error');
        setErrorMessage('Invalid state parameter - possible CSRF attack');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      setStatus('processing');

      try {
        const result = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/api/github-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state: savedState }),
        }).then(r => r.json()).catch(() => null);

        if (result?.token && result?.record) {
          pb.authStore.save(result.token, result.record);
          sessionStorage.removeItem('oauth_state');
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          setStatus('error');
          setErrorMessage('Authentication service unavailable');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Failed to complete authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center max-w-md"
      >
        {status === 'loading' || status === 'processing' ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="font-mono text-lg text-foreground mb-2">
              {status === 'loading' ? 'Connecting to GitHub...' : 'Completing sign in...'}
            </p>
            <p className="font-mono text-sm text-muted-foreground">Please wait</p>
          </>
        ) : status === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <CheckCircle className="w-16 h-16 text-kwestly-green mx-auto mb-4" />
            </motion.div>
            <p className="font-mono text-lg text-kwestly-green mb-2">Success!</p>
            <p className="font-mono text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <AlertCircle className="w-12 h-12 text-kwestly-red mx-auto mb-4" />
            <p className="font-mono text-lg text-kwestly-red mb-2">Authentication Failed</p>
            <p className="font-mono text-sm text-muted-foreground mb-4">{errorMessage}</p>
            <p className="font-mono text-xs text-muted-foreground">Redirecting...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
