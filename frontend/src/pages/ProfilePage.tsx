
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/user/');
        console.log('User details from API:', response.data);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
        
        // Fallback to token data if API call fails
        if (user) {
          setUserData({
            id: user.user_id || user.id || 'N/A',
            username: user.username || 'N/A',
            email: user.email || 'No email provided',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      
      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xl font-medium">{userData?.username || 'Unknown User'}</p>
                  <p className="text-muted-foreground">{userData?.email || 'No email available'}</p>
                </div>
              </div>
              
              <Button
                variant="destructive"
                className="mt-4 w-full gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>Account Info</CardTitle>
              <CardDescription>Your account stats and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-xl font-medium">{userData?.id || 'N/A'}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="text-xl font-medium">Standard</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                View Content
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
