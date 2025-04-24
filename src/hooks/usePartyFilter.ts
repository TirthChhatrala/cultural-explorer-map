
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
}

export function usePartyFilter(parties: Party[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  
  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         party.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         party.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || party.states.includes(selectedState);
    
    return matchesSearch && matchesState;
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    filteredParties,
    states
  };
}
