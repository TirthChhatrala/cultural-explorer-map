
import { useState } from 'react';
import { states } from '../data/states';

export interface Party {
  id: number;
  name: string;
  abbreviation: string;
  founded: number;
  ideology: string;
  leader: string;
  description: string;
  logo: string;
  color: string;
  states: string[];
  type: 'national' | 'state' | 'regional'; // Added party type
  historicalDetails?: string; // Added historical details
  achievements?: string[]; // Added achievements
  currentRepresentation?: {
    loksabha?: number;
    rajyasabha?: number;
    stateAssemblies?: number;
  }; // Added current representation
}

export function usePartyFilter(parties: Party[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLeader, setSelectedLeader] = useState('all');
  
  // Get unique leaders for the filter dropdown
  const uniqueLeaders = Array.from(new Set(parties.map(party => party.leader)));
  
  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          party.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          party.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedState === 'all' || party.states.includes(selectedState);
    const matchesType = selectedType === 'all' || party.type === selectedType;
    const matchesLeader = selectedLeader === 'all' || party.leader === selectedLeader;
    
    return matchesSearch && matchesState && matchesType && matchesLeader;
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedType,
    setSelectedType,
    selectedLeader,
    setSelectedLeader,
    filteredParties,
    states,
    uniqueLeaders
  };
}
