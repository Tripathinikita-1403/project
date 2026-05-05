import React from 'react';
import { Page } from '../types';
import { Theme } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  GardenIcon, 
  SmartHomeIcon, 
  MaintenanceIcon, 
  BudgetIcon, 
  SustainabilityIcon,
  HomeCanvasIcon
} from './icons/IconComponents';

interface UserDashboardProps {
  navigateTo: (page: Page) => void;
  theme: Theme;
}

const features: {
  page: Page;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}[] = [
  {
    page: 'garden',
    title: 'Garden Planner',
    description: 'Design your garden, choose plants, and estimate water usage.',
    icon: <GardenIcon className="w-10 h-10" />,
    color: 'text-eco-green-dark',
    bgColor: 'bg-eco-green-light',
  },
  {
    page: 'homeCanvas',
    title: 'Home Canvas',
    description: 'Visually plan your interior renovations with a drag & drop interface.',
    icon: <HomeCanvasIcon className="w-10 h-10" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    page: 'smartHome',
    title: 'Smart Home Assistant',
    description: 'Discover devices, calculate ROI, and plan your upgrades.',
    icon: <SmartHomeIcon className="w-10 h-10" />,
    color: 'text-sky-blue-dark',
    bgColor: 'bg-sky-blue-light',
  },
  {
    page: 'maintenance',
    title: 'Maintenance Tracker',
    description: 'Log repairs, get reminders, and perform safety checks.',
    icon: <MaintenanceIcon className="w-10 h-10" />,
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
  },
  {
    page: 'budget',
    title: 'Budget Planner',
    description: 'Estimate costs, track expenses, and view long-term savings.',
    icon: <BudgetIcon className="w-10 h-10" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    page: 'timeline',
    title: 'Project Timeline',
    description: 'Visualize project phases and track overall progress.',
    icon: <span className="text-4xl">🗓️</span>,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    page: 'sustainability',
    title: 'Sustainability',
    description: 'Track your carbon footprint and earn eco-badges.',
    icon: <SustainabilityIcon className="w-10 h-10" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    page: 'summary',
    title: 'Project Summary',
    description: 'Get a complete overview of your renovation project.',
    icon: <span className="text-4xl">📊</span>,
    color: 'text-gray-700',
    bgColor: 'bg-gray-200',
  }
];

const FeatureCard: React.FC<{
  feature: typeof features[0];
  navigateTo: (page: Page) => void;
}> = ({ feature, navigateTo }) => (
  <div
    onClick={() => navigateTo(feature.page)}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700/50 hover:scale-[1.02] transition-all duration-300 flex flex-col items-start"
  >
    <div className={`p-3 rounded-full ${feature.bgColor} dark:bg-gray-700`}>
      <div className={`${feature.color} dark:text-gray-100`}>{feature.icon}</div>
    </div>
    <h3 className="font-bold text-lg mt-4 text-gray-800 dark:text-gray-100">{feature.title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex-grow">{feature.description}</p>
    <div className="mt-4 font-semibold text-sm text-eco-green-dark dark:text-eco-green">
      Open Module &rarr;
    </div>
  </div>
);


const consumptionData = [
  { name: 'Jan', energy: 400, water: 240 },
  { name: 'Feb', energy: 300, water: 139 },
  { name: 'Mar', energy: 200, water: 980 },
  { name: 'Apr', energy: 278, water: 390 },
  { name: 'May', energy: 189, water: 480 },
  { name: 'Jun', energy: 239, water: 380 },
];

const pieData = [
  { name: 'Lighting', value: 400 },
  { name: 'HVAC', value: 300 },
  { name: 'Appliances', value: 300 },
  { name: 'Other', value: 200 },
];
const COLORS = ['#A5D6A7', '#4CAF50', '#81D4FA', '#29B6F6'];

const UserDashboard: React.FC<UserDashboardProps> = ({ navigateTo, theme }) => {
  const axisStrokeColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
  const gridStrokeColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Project Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, Anantika! Select a module to begin or review your stats below.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
           <FeatureCard key={feature.page} feature={feature} navigateTo={navigateTo} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 dark:text-gray-200">Energy & Water Consumption (6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis dataKey="name" stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                <YAxis stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }}/>
                <Legend wrapperStyle={{ color: axisStrokeColor }} />
                <Line type="monotone" dataKey="energy" stroke="#4CAF50" name="Energy (kWh)" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="water" stroke="#29B6F6" name="Water (Gal)" />
            </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 text-center dark:text-gray-200">Energy Breakdown</h3>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      fill="#8884d8" 
                      paddingAngle={5} 
                      dataKey="value"
                      labelLine={{ stroke: axisStrokeColor }}
                      label={({ name, percent }) => (typeof percent === 'number' ? `${name} ${(percent * 100).toFixed(0)}%` : name)}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;