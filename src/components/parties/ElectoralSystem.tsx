
import React from 'react';
import { motion } from 'framer-motion';

interface ElectoralSystemProps {
  theme: 'dark' | 'light';
}

const ElectoralSystem: React.FC<ElectoralSystemProps> = ({ theme }) => {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Electoral System</h2>
        
        <div className={`rounded-xl shadow-sm overflow-hidden p-6 ${
          theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">General Elections</h3>
              <p className="text-muted-foreground mb-4">
                India follows a parliamentary system of government, where general elections are held every five years to elect members of the Lok Sabha (House of the People), the lower house of India's bicameral parliament.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                  <span>India uses the first-past-the-post electoral system.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                  <span>The party or coalition with a majority forms the government.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                  <span>The Prime Minister is typically the leader of the majority party or coalition.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">State Elections</h3>
              <p className="text-muted-foreground mb-4">
                State Legislative Assembly elections are held separately for each state, following a similar electoral system. The Chief Minister is typically the leader of the majority party or coalition in the state.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                  <span>State governments have significant autonomy in certain policy areas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                  <span>Different parties may govern at the state and central levels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                  <span>Regional parties often play significant roles in state politics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ElectoralSystem;
