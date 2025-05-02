'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { RootState } from '@/lib/store';
import { removePlayerFromTeam } from '@/lib/features/teams/teamsSlice';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';

interface TeamPlayersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
}

export default function TeamPlayersDialog({
  isOpen,
  onClose,
  teamId,
}: TeamPlayersDialogProps) {
  const team = useSelector((state: RootState) =>
    (state.teams?.teams || []).find((t) => t.id === teamId)
  );
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleRemovePlayer = (playerId: number) => {
    dispatch(removePlayerFromTeam({ teamId, playerId }));
    toast({
      title: 'Player removed',
      description: 'The player has been removed from the team',
    });
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{team.name} - Players</DialogTitle>
          <DialogDescription>
            {team.players.length > 0
              ? `Manage players in ${team.name}`
              : `No players in ${team.name} yet`}
          </DialogDescription>
        </DialogHeader>

        {team.players.length === 0 ? (
          <div className='text-center py-6'>
            <p className='text-muted-foreground'>
              This team has no players. Add players from the Players tab.
            </p>
          </div>
        ) : (
          <div className='space-y-2 max-h-[300px] overflow-y-auto pr-2'>
            {team.players.map((player) => (
              <div
                key={player.id}
                className='flex items-center justify-between p-3 border rounded-md'
              >
                <div className='flex items-center gap-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='text-xs'>
                      {player.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{player.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {player.position} • {player.team}
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleRemovePlayer(player.id)}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
