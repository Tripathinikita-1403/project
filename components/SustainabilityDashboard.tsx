
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LeafIcon, WaterDropIcon } from './icons/IconComponents';
import { Theme } from '../App';

const carbonData = [
  { name: 'Jan', footprint: 400 },
  { name: 'Feb', footprint: 380 },
  { name: 'Mar', footprint: 350 },
  { name: 'Apr', footprint: 320 },
  { name: 'May', footprint: 310 },
  { name: 'Jun', footprint: 290 },
];

const ecoBadges = [
  { name: 'Energy Saver', icon: '⚡️', description: 'Reduced energy use by 15%.' },
  { name: 'Water Wise', icon: '💧', description: 'Installed a smart irrigation system.' },
  { name: 'Solar Powered', icon: '☀️', description: 'Generated 500 kWh of solar energy.' },
  { name: 'Recycling Champion', icon: '♻️', description: 'Diverted 80% of waste from landfill.' },
];

interface SustainabilityDashboardProps {
  theme: Theme;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ theme }) => {
  const axisStrokeColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
  const gridStrokeColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Sustainability Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4 dark:text-gray-200">Carbon Footprint Tracker (kg CO₂e)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={carbonData}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
              <XAxis dataKey="name" stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
              <YAxis stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
              <Area type="monotone" dataKey="footprint" stroke="#4CAF50" fill="url(#colorCarbon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold mb-2 dark:text-gray-200">This Month's Savings</h3>
              <div className="flex justify-around mt-4">
                  <div className="text-eco-green-dark dark:text-eco-green-light">
                      <LeafIcon className="w-10 h-10 mx-auto"/>
                      <p className="font-bold text-2xl">58 kWh</p>
                      <p className="text-sm">Energy</p>
                  </div>
                   <div className="text-sky-blue-dark dark:text-sky-blue-light">
                      <WaterDropIcon className="w-10 h-10 mx-auto"/>
                      <p className="font-bold text-2xl">120 gal</p>
                      <p className="text-sm">Water</p>
                  </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="font-semibold mb-4 dark:text-gray-200">Eco-Friendly Tips</h3>
                <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Switch to LED bulbs to save up to 75% on lighting energy.</li>
                    <li>Use a smart thermostat to optimize heating and cooling.</li>
                    <li>Compost food scraps to reduce landfill waste.</li>
                </ul>
            </div>
        </div>
        
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Achievements & Eco-Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ecoBadges.map(badge => (
                    <div key={badge.name} className="p-4 bg-eco-green-light dark:bg-gray-700 rounded-lg text-center flex flex-col items-center">
                        <span className="text-4xl mb-2">{badge.icon}</span>
                        <h4 className="font-bold text-eco-green-dark dark:text-eco-green-light">{badge.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default SustainabilityDashboard;