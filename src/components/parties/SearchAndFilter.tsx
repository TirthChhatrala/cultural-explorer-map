
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { states } from '../../data/states';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  theme: 'dark' | 'light';
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedState,
  setSelectedState,
  theme
}) => {
  return (
    <section className="mb-8">
      <div className={`rounded-xl shadow-sm p-4 md:p-6 ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search political parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className={`pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilter;
