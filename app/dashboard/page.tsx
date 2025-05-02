'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux';
import DashboardLayout from '@/components/dashboard-layout';
import PlayersList from '@/components/players-list';
import TeamsList from '@/components/teams-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
