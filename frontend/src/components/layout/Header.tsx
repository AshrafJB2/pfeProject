
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { LogOut, User, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      // If we already have user data with username, no need to fetch
      if (userData?.username) return;
      
      try {
        const response = await axios.get('http://localhost:8000/api/user/');
        console.log('User details from API:', response.data);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        
        // Fallback to token data if API call fails
        if (user) {
          setUserData({
            id: user.user_id || user.id || 'N/A',
            username: user.username || 'N/A',
            email: user.email || 'No email provided',
          });
        }
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="rounded-md bg-primary p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </motion.div>
            <span className="hidden font-bold sm:inline-block">ContentScribe</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="default" className="hidden sm:flex">
            <Link to="/create">Create Content</Link>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
                  >
                    <User className="h-4 w-4" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full gap-2">
                    <User className="h-4 w-4" />
                    <span>{userData?.username || user.username || 'User'}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.header>
  );
}
