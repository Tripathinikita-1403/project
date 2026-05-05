import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Theme } from '../App';

const budgetItems = [
  { category: 'Garden & Landscape', cost: 350000 },
  { category: 'Smart Home Upgrades', cost: 520000 },
  { category: 'Kitchen Renovation', cost: 1200000 },
  { category: 'Bathroom Renovation', cost: 800000 },
  { category: 'Maintenance Fund', cost: 150000 },
];

const COLORS = ['#A5D6A7', '#4CAF50', '#81D4FA', '#29B6F6', '#D7CCC8'];

const expenseVsSavingsData = [
  { name: 'Upfront Cost', expense: 2500000, savings: 0 },
  { name: 'Year 1 Savings', expense: 0, savings: 180000 },
  { name: 'Year 5 Savings', expense: 0, savings: 950000 },
];

interface BudgetPlannerProps {
  theme: Theme;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ theme }) => {
  const totalBudget = budgetItems.reduce((acc, item) => acc + item.cost, 0);

  const axisStrokeColor = theme === 'dark' ? '#9CA3AF' : '#4B5563';
  const gridStrokeColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold dark:text-gray-100">Cost Estimation & Budget Planner</h2>
        <div>
          <button className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mr-2">Export PDF</button>
          <button className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Export Excel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Itemized list and total */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Itemized Breakdown</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Estimated Cost</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium dark:text-gray-200">{item.category}</td>
                  <td className="px-6 py-4 dark:text-gray-300">₹{item.cost.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Edit</a></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-3 text-base">Total</th>
                <td className="px-6 py-3 text-base">₹{totalBudget.toLocaleString('en-IN')}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Right column: Charts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 text-xl text-center dark:text-gray-200">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={budgetItems}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: axisStrokeColor }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cost"
                  nameKey="category"
                  label={({ percent }) => (typeof percent === 'number' ? `${(percent * 100).toFixed(0)}%` : '')}
                >
                  {budgetItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4 text-xl text-center dark:text-gray-200">Expense vs. Savings Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={expenseVsSavingsData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                    <XAxis type="number" stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                    <YAxis type="category" dataKey="name" width={80} stroke={axisStrokeColor} tick={{ fill: axisStrokeColor }} />
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} cursor={{fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}} contentStyle={{ backgroundColor: tooltipBgColor, border: `1px solid ${gridStrokeColor}` }} />
                    <Legend wrapperStyle={{ color: axisStrokeColor }} />
                    <Bar dataKey="expense" stackId="a" fill="#F44336" />
                    <Bar dataKey="savings" stackId="a" fill="#4CAF50" />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;