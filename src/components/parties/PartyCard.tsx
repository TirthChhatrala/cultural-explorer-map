
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Flag, Users, Calendar, Award } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface PartyCardProps {
  name: string;
  abbreviation: string;
  founded: number;
  ideology: string;
  leader: string;
  description: string;
  logo: string;
  color: string;
  states: string[];
  type: 'national' | 'state' | 'regional';
  historicalDetails?: string;
  achievements?: string[];
  currentRepresentation?: {
    loksabha?: number;
    rajyasabha?: number;
    stateAssemblies?: number;
  };
  delay?: number;
  theme: 'dark' | 'light';
}

const PartyCard: React.FC<PartyCardProps> = ({
  name,
  abbreviation,
  founded,
  ideology,
  leader,
  description,
  logo,
  color,
  states,
  type,
  historicalDetails,
  achievements,
  currentRepresentation,
  delay = 0,
  theme
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1], delay }}
      className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}20` }}
            >
              <img 
                src={logo} 
                alt={`${name} logo`} 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-india-orange font-medium">{abbreviation}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Founded: {founded}</p>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Party
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between mb-3">
              <div>
                <span className="text-sm font-medium">Ideology:</span>
                <p className="text-muted-foreground text-sm">{ideology}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Leader:</span>
                <p className="text-muted-foreground text-sm">{leader}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{description}</p>
            
            <div className="mb-4">
              <span className="text-sm font-medium flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4" /> Prominent in:
              </span>
              <div className="flex flex-wrap gap-2">
                {states.map((state, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className={`w-full px-4 py-2 text-center rounded-md mt-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {expanded ? 'Show Less' : 'Show More Details'}
            </button>
            
            {expanded && (
              <div className="mt-4 border-t pt-4">
                <Tabs defaultValue="historical">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="historical">Historical Details</TabsTrigger>
                    <TabsTrigger value="current">Current Representation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="historical" className="mt-4">
                    <div className="space-y-4">
                      {historicalDetails && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Calendar className="w-4 h-4" /> History:
                          </span>
                          <p className="text-muted-foreground text-sm">{historicalDetails}</p>
                        </div>
                      )}
                      
                      {achievements && achievements.length > 0 && (
                        <div>
                          <span className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Award className="w-4 h-4" /> Key Achievements:
                          </span>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="current" className="mt-4">
                    {currentRepresentation ? (
                      <div className="space-y-4">
                        <span className="text-sm font-medium flex items-center gap-1 mb-2">
                          <Users className="w-4 h-4" /> Current Representation:
                        </span>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Legislature</TableHead>
                              <TableHead className="text-right">Seats</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentRepresentation.loksabha !== undefined && (
                              <TableRow>
                                <TableCell>Lok Sabha</TableCell>
                                <TableCell className="text-right">{currentRepresentation.loksabha}</TableCell>
                              </TableRow>
                            )}
                            {currentRepresentation.rajyasabha !== undefined && (
                              <TableRow>
                                <TableCell>Rajya Sabha</TableCell>
                                <TableCell className="text-right">{currentRepresentation.rajyasabha}</TableCell>
                              </TableRow>
                            )}
                            {currentRepresentation.stateAssemblies !== undefined && (
                              <TableRow>
                                <TableCell>State Assemblies</TableCell>
                                <TableCell className="text-right">{currentRepresentation.stateAssemblies}</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No current representation data available.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PartyCard;
