'use client';

import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    router.push('/');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faBasketball} className='h-6 w-6' />
            <h1 className='text-xl font-bold'>Basketball Team Management</h1>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              <span className='font-medium'>{user}</span>
            </div>
            <Button variant='outline' size='sm' onClick={handleLogout}>
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 container mx-auto px-4 py-6'>{children}</main>
    </div>
  );
}
