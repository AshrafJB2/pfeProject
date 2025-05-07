
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Redirect based on authentication status
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" className="border-primary" />
    </div>
  );
};

export default Index;
