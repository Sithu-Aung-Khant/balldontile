'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/dashboard-layout';
import PlayersList from '@/components/players-list';
import TeamsList from '@/components/teams-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue='players' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='players'>Players</TabsTrigger>
          <TabsTrigger value='teams'>Teams</TabsTrigger>
        </TabsList>
        <TabsContent value='players' className='mt-4'>
          <PlayersList />
        </TabsContent>
        <TabsContent value='teams' className='mt-4'>
          <TeamsList />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
