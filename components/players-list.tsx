'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus } from 'lucide-react';
import { addPlayerToTeam } from '@/lib/features/teams/teamsSlice';
import type { RootState } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  team: {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  };
}

const mockPlayers: Player[] = [
  {
    id: 1,
    first_name: 'LeBron',
    last_name: 'James',
    position: 'SF',
    team: {
      id: 1,
      abbreviation: 'LAL',
      city: 'Los Angeles',
      conference: 'West',
      division: 'Pacific',
      full_name: 'Los Angeles Lakers',
      name: 'Lakers',
    },
  },
  {
    id: 2,
    first_name: 'Stephen',
    last_name: 'Curry',
    position: 'PG',
    team: {
      id: 2,
      abbreviation: 'GSW',
      city: 'Golden State',
      conference: 'West',
      division: 'Pacific',
      full_name: 'Golden State Warriors',
      name: 'Warriors',
    },
  },
  {
    id: 3,
    first_name: 'Kevin',
    last_name: 'Durant',
    position: 'PF',
    team: {
      id: 3,
      abbreviation: 'BKN',
      city: 'Brooklyn',
      conference: 'East',
      division: 'Atlantic',
      full_name: 'Brooklyn Nets',
      name: 'Nets',
    },
  },
  // Add more mock players as needed
];

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const [hasMore] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPlayerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const teams = useSelector((state: RootState) => state.teams?.teams || []);
  const playersInTeams = useSelector((state: RootState) =>
    (state.teams?.teams || []).flatMap((team) =>
      team.players.map((player) => player.id)
    )
  );

  useEffect(() => {
    setPlayers(mockPlayers);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        // No more data to load since we're using mock data
      }
    });

    if (lastPlayerRef.current) {
      observer.current.observe(lastPlayerRef.current);
    }
  }, [loading, hasMore, page]);

  const handleAddToTeam = (player: Player) => {
    if (!selectedTeam) {
      toast({
        title: 'Error',
        description: 'Please select a team first',
        variant: 'destructive',
      });
      return;
    }

    if (playersInTeams.includes(player.id)) {
      toast({
        title: 'Error',
        description: 'This player is already in a team',
        variant: 'destructive',
      });
      return;
    }

    dispatch(
      addPlayerToTeam({
        teamId: selectedTeam,
        player: {
          id: player.id,
          name: `${player.first_name} ${player.last_name}`,
          position: player.position || 'N/A',
          team: player.team.full_name,
        },
      })
    );

    toast({
      title: 'Success',
      description: `${player.first_name} ${player.last_name} added to team`,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Players</h2>
        <div className='flex items-center gap-2'>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select a team' />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {players.map((player, index) => {
          const isLastPlayer = index === players.length - 1;
          const isInTeam = playersInTeams.includes(player.id);

          return (
            <div key={player.id} ref={isLastPlayer ? lastPlayerRef : null}>
              <Card>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <CardTitle>{`${player.first_name} ${player.last_name}`}</CardTitle>
                      <CardDescription>
                        {player.position || 'Position not specified'}
                      </CardDescription>
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {player.first_name[0]}
                        {player.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex justify-between items-center'>
                    <Badge variant='outline'>{player.team.full_name}</Badge>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleAddToTeam(player)}
                      disabled={isInTeam || !selectedTeam}
                    >
                      {isInTeam ? (
                        <span className='text-xs'>Already in team</span>
                      ) : (
                        <>
                          <UserPlus className='h-4 w-4 mr-1' />
                          Add to team
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <div>
                    <Skeleton className='h-5 w-40 mb-2' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-10 w-10 rounded-full' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-9 w-24' />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {!hasMore && players.length > 0 && (
        <p className='text-center text-muted-foreground mt-4'>
          No more players to load
        </p>
      )}

      {!loading && players.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>No players found</p>
        </div>
      )}
    </div>
  );
}
