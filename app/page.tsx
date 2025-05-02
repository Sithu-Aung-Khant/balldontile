'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LoginForm from '@/components/login-form';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 sm:p-24'>
      <div className='w-full max-w-md'>
        <h1 className='text-3xl font-semibold mb-8 text-center'>
          NBA Team Management
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
