'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with Zod
const teamFormSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  playerCount: z.number().max(30, 'Team cannot have more than 30 players'),
  region: z.string().min(1, 'Region is required'),
  country: z.string().min(1, 'Country is required'),
});

// Infer TypeScript type from Zod schema
type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  team?: Team;
}

export default function TeamFormModal({
  isOpen,
  onClose,
  mode,
  team,
}: TeamFormModalProps) {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]); // Local state for teams

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      playerCount: 1,
      region: '',
      country: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && team) {
      form.reset({
        name: team.full_name,
        playerCount: team.playerCount,
        region: team.division,
        country: team.country,
      });
    } else {
      form.reset();
    }
  }, [mode, team, isOpen, form]);

  const handleSubmit = async (values: TeamFormValues) => {
    // Check for unique team name
    const isNameTaken = teams.some(
      (t) =>
        t.name.toLowerCase() === values.name.toLowerCase() &&
        (mode === 'create' || (mode === 'edit' && t.id !== team?.id))
    );

    if (isNameTaken) {
      form.setError('name', {
        type: 'manual',
        message: 'Team name must be unique',
      });
      return;
    }

    if (mode === 'create') {
      const newTeam = {
        id: Date.now(),
        ...values,
        full_name: values.name,
        division: values.region,
        players: [],
      };

      // Add team to local state (replace with API call if needed)
      setTeams((prev) => [...prev, newTeam]);

      toast({
        title: 'Team created',
        description: 'The team has been successfully created',
      });
    } else if (mode === 'edit' && team?.id) {
      // Update team in local state (replace with API call if needed)
      setTeams((prev) =>
        prev.map((t) =>
          t.id === team.id
            ? {
                ...t,
                ...values,
                full_name: values.name,
                division: values.region,
              }
            : t
        )
      );

      toast({
        title: 'Team updated',
        description: 'The team has been successfully updated',
      });
    }

    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Team' : 'Edit Team'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details to create a new team'
              : 'Update the team details'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter team name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='playerCount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Count</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={30}
                      placeholder='Enter player count'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='region'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter region' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>
                {mode === 'create' ? 'Create' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
