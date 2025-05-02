'use client';

import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TeamFormModal from '@/components/team-form-modal';
import DeleteTeamDialog from '@/components/delete-team-dialog';
import TeamPlayersDialog from '@/components/team-players-dialog';
import { Badge } from '@/components/ui/badge';

const mockTeams = [
  {
    id: '1',
    name: 'Los Angeles Lakers',
    region: 'California',
    country: 'USA',
    players: [
      {
        id: 1,
        name: 'LeBron James',
        position: 'SF',
        team: 'Los Angeles Lakers',
      },
      {
        id: 2,
        name: 'Anthony Davis',
        position: 'PF',
        team: 'Los Angeles Lakers',
      },
    ],
  },
  {
    id: '2',
    name: 'Golden State Warriors',
    region: 'California',
    country: 'USA',
    players: [
      {
        id: 3,
        name: 'Stephen Curry',
        position: 'PG',
        team: 'Golden State Warriors',
      },
      {
        id: 4,
        name: 'Klay Thompson',
        position: 'SG',
        team: 'Golden State Warriors',
      },
    ],
  },
  // Add more mock teams as needed
];

export default function TeamsList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlayersDialogOpen, setIsPlayersDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState(mockTeams); // Use mock data instead of Redux
  const { toast } = useToast();

  const handleOpenEditModal = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenPlayersDialog = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsPlayersDialogOpen(true);
  };

  const handleDeleteTeam = () => {
    if (selectedTeam) {
      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== selectedTeam)
      );
      toast({
        title: 'Team deleted',
        description: 'The team has been successfully deleted',
      });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Teams</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className='text-center py-12 border rounded-lg'>
          <h3 className='text-lg font-medium mb-2'>No teams yet</h3>
          <p className='text-muted-foreground mb-4'>
            Create your first team to get started
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Create Team
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {team.region}, {team.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  <span>
                    {team.players.length} player
                    {team.players.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {team.players.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {team.players.slice(0, 3).map((player) => (
                      <Badge
                        key={player.id}
                        variant='secondary'
                        className='text-xs'
                      >
                        {player.name}
                      </Badge>
                    ))}
                    {team.players.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{team.players.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleOpenPlayersDialog(team.id)}
                >
                  <Users className='h-4 w-4 mr-2' />
                  Players
                </Button>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleOpenEditModal(team.id)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleOpenDeleteDialog(team.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <TeamFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode='create'
      />

      {selectedTeam && (
        <>
          <TeamFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            mode='edit'
            teamId={selectedTeam}
          />

          <DeleteTeamDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteTeam}
          />

          <TeamPlayersDialog
            isOpen={isPlayersDialogOpen}
            onClose={() => setIsPlayersDialogOpen(false)}
            teamId={selectedTeam}
          />
        </>
      )}
    </div>
  );
}
