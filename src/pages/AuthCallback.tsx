import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import pb from '@/services/pocketbase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const provider = urlParams.get('provider');
        const state = urlParams.get('state');
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (provider && state && code) {
          await pb.collection('users').authWithOAuth2Code(provider, code, state, window.location.origin + '/auth/callback');
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 500);
        } else if (pb.authStore.isValid) {
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 500);
        } else {
          await pb.collection('users').authRefresh();
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 500);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <p className="font-mono text-kwestly-red mb-4">Authentication failed: {error}</p>
          <p className="font-mono text-xs text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-kwestly-green animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-kwestly-green">Success! Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
