import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Theme } from '../App';

const devices = [
  { name: 'Solar Panels', icon: '☀️', avgCost: 1500000, avgSaving: 15000, description: "Generate your own clean energy and reduce electricity bills significantly." },
  { name: 'Smart Thermostat', icon: '🌡️', avgCost: 25000, avgSaving: 1500, description: "Automatically adjusts temperature settings for optimal energy use." },
  { name: 'Smart Locks', icon: '🔒', avgCost: 20000, avgSaving: 0, description: "Enhance security with keyless entry and remote access control." },
  { name: 'LED Smart Lighting', icon: '💡', avgCost: 50000, avgSaving: 1000, description: "Control lighting remotely and use up to 75% less energy than incandescent." },
];

const savingsData = [
  { name: 'Year 1', savings: 150000 },
  { name: 'Year 2', savings: 320000 },
  { name: 'Year 3', savings: 500000 },
  { name: 'Year 4', savings: 680000 },
  { name: 'Year 5', savings: 870000 },
];

interface SmartHomePlannerProps {
  theme: Theme;
}

const SmartHomePlanner: React.FC<SmartHomePlannerProps> = ({ theme }) => {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [cost, setCost] = useState(selectedDevice.avgCost);
  const [monthlySaving, setMonthlySaving] = useState(selectedDevice.avgSaving);

  const roi = useMemo(() => {
    if (monthlySaving <= 0) return "N/A (Non-energy saving)";
    const months = cost / monthlySaving;
    if (months > 12) {
      return `${(months / 12).toFixed(1)} years`;
    }
    return `${months.toFixed(1)} months`;
  }, [cost, monthlySaving]);
  
  const handleDeviceSelect = (device: typeof devices[0]) => {
      setSelectedDevice(device);
      setCost(device.avgCost);
      setMonthlySaving(device.avgSaving);
  }

  const axisStrokeColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
  const gridStrokeColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Smart Home Upgrade Assistant</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 dark:text-gray-200">Device Recommendations</h3>
            <div className="space-y-2">
              {devices.map(device => (
                <button
                  key={device.name}
                  onClick={() => handleDeviceSelect(device)}
                  className={`w-full text-left p-3 rounded-lg flex items-center transition-colors duration-200 ${selectedDevice.name === device.name ? 'bg-sky-blue-light text-sky-blue-dark dark:bg-gray-700 dark:text-sky-blue-light shadow-inner' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <span className="text-2xl mr-4 p-2 bg-gray-200 dark:bg-gray-600 rounded-full" style={{ textShadow: '0 0 10px rgba(41, 182, 246, 0.7)' }}>{device.icon}</span>
                  <span className="font-medium dark:text-gray-200">{device.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 dark:text-gray-200">Integration Tips</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ensure your new smart devices are compatible with your existing home WiFi network (2.4GHz is most common). Consider a central hub like Amazon Alexa or Google Home for seamless voice control and automation routines.</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-xl mb-2 dark:text-gray-200">{selectedDevice.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedDevice.description}</p>
            
            <h4 className="font-semibold mt-6 mb-2 dark:text-gray-200">ROI Calculator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Cost (₹)</label>
                <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-blue focus:border-sky-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Est. Monthly Saving (₹)</label>
                <input type="number" value={monthlySaving} onChange={e => setMonthlySaving(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-blue focus:border-sky-blue" />
              </div>
            </div>
            <div className="mt-4 p-4 bg-sky-blue-light dark:bg-sky-blue-dark/20 rounded-lg text-center">
              <p className="font-bold text-sky-blue-dark dark:text-sky-blue-light text-lg">Return on Investment: {roi}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 dark:text-gray-200">5-Year Energy Savings Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis dataKey="name" stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                <YAxis stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} cursor={{fill: theme === 'dark' ? 'rgba(129, 212, 250, 0.1)' : 'rgba(129, 212, 250, 0.3)'}} contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
                <Legend wrapperStyle={{ color: axisStrokeColor }} />
                <Bar dataKey="savings" fill="url(#colorUv)" name="Cumulative Savings" />
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#29B6F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A5D6A7" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SmartHomePlanner;