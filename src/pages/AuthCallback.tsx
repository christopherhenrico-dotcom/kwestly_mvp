import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import pb from '@/services/pocketbase';

const AuthCallback: () => JSX.Element = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    
    if (state && code) {
      pb.collection('users').authWithOAuth2Code('github', code, state, window.location.origin + '/auth/callback')
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch((err) => {
          console.error('OAuth callback error:', err);
          setError(err.message || 'Authentication failed');
          setTimeout(() => navigate('/', { replace: true }), 3000);
        });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-kwestly-red mb-4">{error}</p>
          <p className="font-mono text-xs text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="font-mono text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
