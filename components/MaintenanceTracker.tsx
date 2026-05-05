import React, { useState } from 'react';

const recurringTasks = [
    { id: 1, name: 'AC Filter Change', frequency: '3 Months', nextDue: '2024-08-01' },
    { id: 2, name: 'Plumbing Check', frequency: '6 Months', nextDue: '2024-10-15' },
    { id: 3, name: 'Pest Control', frequency: 'Quarterly', nextDue: '2024-09-05' },
    { id: 4, name: 'Gutter Cleaning', frequency: 'Annually', nextDue: '2024-11-20' },
];

const repairHistory = [
    { id: 1, date: '2024-05-20', item: 'Leaky Faucet', cost: 15000, receipt: 'receipt-faucet.pdf' },
    { id: 2, date: '2024-02-10', item: 'HVAC Tune-up', cost: 25000, receipt: 'receipt-hvac.pdf' },
];

const safetyChecklistItems = [
    { id: 'fire', label: 'Check smoke/CO detectors' },
    { id: 'electrical', label: 'Inspect outlets and cords' },
    { id: 'gas', label: 'Check for gas leaks (smell)' },
    { id: 'structural', label: 'Look for cracks in foundation' },
];

const MaintenanceTracker: React.FC = () => {
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    const handleChecklistChange = (id: string) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Maintenance & Safety Tracker</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Recurring Reminders</h3>
                        <div className="space-y-3">
                            {recurringTasks.map(task => (
                                <div key={task.id} className="p-3 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-yellow-800 dark:text-yellow-300">{task.name}</p>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">Next Due: {task.nextDue}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-full">{task.frequency}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Repair History</h3>
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Item</th>
                                    <th className="px-4 py-2">Cost</th>
                                    <th className="px-4 py-2">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repairHistory.map(item => (
                                    <tr key={item.id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{item.date}</td>
                                        <td className="px-4 py-2 font-medium">{item.item}</td>
                                        <td className="px-4 py-2">₹{item.cost.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2"><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">View</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Upload Receipt</button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Safety Audit Checklist</h3>
                        <div className="space-y-3">
                            {safetyChecklistItems.map(item => (
                                <label key={item.id} className="flex items-center p-3 bg-red-50 dark:bg-red-500/10 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!checklist[item.id]}
                                        onChange={() => handleChecklistChange(item.id)}
                                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500 bg-transparent"
                                    />
                                    <span className={`ml-3 text-gray-700 dark:text-gray-300 ${checklist[item.id] ? 'line-through' : ''}`}>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                        <h3 className="font-semibold mb-4 text-xl dark:text-gray-200">Need Professional Help?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Book trusted service providers for your maintenance needs.</p>
                        <button className="px-6 py-3 bg-eco-green-dark text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                            Book a Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceTracker;