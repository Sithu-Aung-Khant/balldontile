'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Label } from '@/components/ui/label';
import { addTeam, updateTeam } from '@/lib/features/teams/teamsSlice';
import type { RootState } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  teamId?: string;
}

export default function TeamFormModal({
  isOpen,
  onClose,
  mode,
  teamId,
}: TeamFormModalProps) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useDispatch();
  const { toast } = useToast();
  const teams = useSelector((state: RootState) => state.teams?.teams || []);
  const team = teams.find((t) => t.id === teamId);

  useEffect(() => {
    if (mode === 'edit' && team) {
      setName(team.name);
      setRegion(team.region);
      setCountry(team.country);
    } else {
      resetForm();
    }
  }, [mode, team, isOpen]);

  const resetForm = () => {
    setName('');
    setRegion('');
    setCountry('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (
      mode === 'create' &&
      teams.some((team) => team.name.toLowerCase() === name.toLowerCase())
    ) {
      newErrors.name = 'Team name must be unique';
    } else if (
      mode === 'edit' &&
      teams.some(
        (t) => t.id !== teamId && t.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      newErrors.name = 'Team name must be unique';
    }

    if (!region.trim()) {
      newErrors.region = 'Region is required';
    }

    if (!country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      const newTeam = {
        id: uuidv4(),
        name,
        region,
        country,
        players: [],
      };

      dispatch(addTeam(newTeam));
      toast({
        title: 'Team created',
        description: 'The team has been successfully created',
      });
    } else if (mode === 'edit' && teamId) {
      dispatch(
        updateTeam({
          id: teamId,
          changes: { name, region, country },
        })
      );
      toast({
        title: 'Team updated',
        description: 'The team has been successfully updated',
      });
    }

    onClose();
    resetForm();
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
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Team Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter team name'
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='region'>Region</Label>
              <Input
                id='region'
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder='Enter region'
                className={errors.region ? 'border-red-500' : ''}
              />
              {errors.region && (
                <p className='text-sm text-red-500'>{errors.region}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Enter country'
                className={errors.country ? 'border-red-500' : ''}
              />
              {errors.country && (
                <p className='text-sm text-red-500'>{errors.country}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>
              {mode === 'create' ? 'Create' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
