import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LeafIcon } from './icons/IconComponents';
import { Theme } from '../App';

const summaryData = {
  renovationProgress: 95,
  landscapeProgress: 100,
  upgradesProgress: 90,
  budgetSpent: 2850000,
  budgetTotal: 3020000,
  sustainabilityScore: 88,
  savings: {
    energy: 180000,
    water: 45000,
  },
};

const progressData = [
  { name: 'Renovation', value: summaryData.renovationProgress, color: '#A5D6A7' },
  { name: 'Landscape', value: summaryData.landscapeProgress, color: '#4CAF50' },
  { name: 'Upgrades', value: summaryData.upgradesProgress, color: '#81D4FA' },
];

const SummaryCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md ${className}`}>
        <h3 className="font-semibold text-lg mb-4 dark:text-gray-200">{title}</h3>
        {children}
    </div>
);

interface ProjectSummaryProps {
  theme: Theme;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ theme }) => {
    const budgetPieData = [
        { name: 'Spent', value: summaryData.budgetSpent },
        { name: 'Remaining', value: summaryData.budgetTotal - summaryData.budgetSpent },
    ];
    const COLORS = ['#4CAF50', theme === 'dark' ? '#374151' : '#E0F2F1'];

    const gridStrokeColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    const tooltipBgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold dark:text-gray-100">Project Summary</h2>
                <button className="px-6 py-2 bg-eco-green-dark text-white font-bold rounded-full shadow-lg hover:bg-green-600">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <SummaryCard title="Overall Progress">
                    <div className="space-y-4">
                        {progressData.map(item => (
                            <div key={item.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium dark:text-gray-300">{item.name}</span>
                                    <span className="text-sm font-medium dark:text-gray-300">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="h-2.5 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SummaryCard>

                <SummaryCard title="Budget Overview">
                   <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie
                                data={budgetPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {budgetPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center mt-2 text-lg">
                        <strong className="dark:text-gray-200">₹{summaryData.budgetSpent.toLocaleString('en-IN')}</strong>
                        <span className="text-gray-500 dark:text-gray-400"> / ₹{summaryData.budgetTotal.toLocaleString('en-IN')} spent</span>
                    </p>
                </SummaryCard>
                
                <SummaryCard title="Sustainability Score" className="flex flex-col items-center justify-center text-center bg-eco-green-light dark:bg-gray-700 text-eco-green-dark dark:text-eco-green-light">
                    <LeafIcon className="w-16 h-16"/>
                    <p className="text-6xl font-bold my-2">{summaryData.sustainabilityScore}<span className="text-2xl">%</span></p>
                    <p className="font-medium">Excellent</p>
                </SummaryCard>

                <SummaryCard title="Projected Annual Savings" className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-sky-blue-light dark:bg-sky-blue-900/40 rounded-lg">
                            <p className="text-sm text-sky-blue-dark dark:text-sky-blue-300">Energy Savings</p>
                            <p className="text-3xl font-bold text-sky-blue-dark dark:text-sky-blue-200">₹{summaryData.savings.energy.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 bg-eco-green-light dark:bg-eco-green-900/40 rounded-lg">
                            <p className="text-sm text-eco-green-dark dark:text-eco-green-300">Water Savings</p>
                            <p className="text-3xl font-bold text-eco-green-dark dark:text-eco-green-200">₹{summaryData.savings.water.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </SummaryCard>

            </div>
        </div>
    );
};

export default ProjectSummary;