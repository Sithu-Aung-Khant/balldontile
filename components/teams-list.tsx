'use client';

import { useEffect, useState } from 'react';
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
import { BalldontlieAPI } from '@balldontlie/sdk';
import { Skeleton } from '@/components/ui/skeleton';

const api = new BalldontlieAPI({
  apiKey: process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY || '',
});

interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
}

interface Team {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
}

export default function TeamsList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlayersDialogOpen, setIsPlayersDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsResponse = await api.nba.getTeams();
        const mappedTeams = teamsResponse.data.map((team) => ({
          id: team.id,
          conference: team.conference,
          division: team.division,
          city: team.city,
          name: team.name,
          full_name: team.full_name,
          abbreviation: team.abbreviation,
          playerCount: 0, // Default value
          region: team.division, // Map division to region
          country: 'USA', // Default value
          players: [], // Default value
        }));
        setTeams(mappedTeams);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleOpenEditModal = (team: Team) => {
    setSelectedTeam(team.id);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (teamId: number) => {
    setSelectedTeam(teamId);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenPlayersDialog = (teamId: number) => {
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

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-24 mt-2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-20' />
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Skeleton className='h-9 w-24' />
                <div className='flex gap-2'>
                  <Skeleton className='h-9 w-9' />
                  <Skeleton className='h-9 w-9' />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : teams.length === 0 ? (
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
                <CardTitle>{team.full_name}</CardTitle>
                <CardDescription>
                  {team.city}, {team.conference} - {team.division}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>{team.abbreviation}</Badge>
                </div>
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
                    onClick={() => handleOpenEditModal(team)}
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
            team={teams.find((t) => t.id === selectedTeam)}
          />

          <DeleteTeamDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteTeam}
          />

          <TeamPlayersDialog
            isOpen={isPlayersDialogOpen}
            onClose={() => setIsPlayersDialogOpen(false)}
            teamId={selectedTeam.toString()}
          />
        </>
      )}
    </div>
  );
}
