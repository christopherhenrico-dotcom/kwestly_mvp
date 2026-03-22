import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage(error);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          api.setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } catch {
          setStatus('error');
          setErrorMessage('Failed to parse user data');
          setTimeout(() => navigate('/'), 3000);
        }
      } else {
        // Check if already logged in
        if (api.getToken()) {
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          setStatus('error');
          setErrorMessage('No authentication data received');
          setTimeout(() => navigate('/'), 3000);
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card p-8 text-center max-w-md"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="font-mono text-lg text-foreground mb-2">Connecting to GitHub...</p>
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
