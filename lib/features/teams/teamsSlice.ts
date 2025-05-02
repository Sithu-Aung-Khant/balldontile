"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Player {
  id: number
  name: string
  position: string
  team: string
}

interface Team {
  id: string
  name: string
  region: string
  country: string
  players: Player[]
}

interface TeamsState {
  teams: Team[]
}

// Load initial state from localStorage if available (client-side only)
const loadInitialState = (): TeamsState => {
  if (typeof window !== "undefined") {
    try {
      const persistedState = localStorage.getItem("reduxState")
      if (persistedState) {
        const state = JSON.parse(persistedState)
        if (state.teams && Array.isArray(state.teams.teams)) {
          return state.teams
        }
      }
    } catch (e) {
      console.error("Error loading state from localStorage:", e)
    }
  }
  return { teams: [] }
}

const initialState: TeamsState = loadInitialState()

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload)
    },
    updateTeam: (state, action: PayloadAction<{ id: string; changes: Partial<Team> }>) => {
      const { id, changes } = action.payload
      const teamIndex = state.teams.findIndex((team) => team.id === id)
      if (teamIndex !== -1) {
        state.teams[teamIndex] = { ...state.teams[teamIndex], ...changes }
      }
    },
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload)
    },
    addPlayerToTeam: (state, action: PayloadAction<{ teamId: string; player: Player }>) => {
      const { teamId, player } = action.payload

      // First, remove the player from any team they might be in
      state.teams.forEach((team) => {
        team.players = team.players.filter((p) => p.id !== player.id)
      })

      // Then add the player to the selected team
      const teamIndex = state.teams.findIndex((team) => team.id === teamId)
      if (teamIndex !== -1) {
        state.teams[teamIndex].players.push(player)
      }
    },
    removePlayerFromTeam: (state, action: PayloadAction<{ teamId: string; playerId: number }>) => {
      const { teamId, playerId } = action.payload
      const teamIndex = state.teams.findIndex((team) => team.id === teamId)
      if (teamIndex !== -1) {
        state.teams[teamIndex].players = state.teams[teamIndex].players.filter((player) => player.id !== playerId)
      }
    },
  },
})

export const { addTeam, updateTeam, removeTeam, addPlayerToTeam, removePlayerFromTeam } = teamsSlice.actions

export default teamsSlice.reducer
