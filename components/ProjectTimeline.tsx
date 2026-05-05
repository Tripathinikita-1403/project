
import React from 'react';

const timelineData = [
  {
    category: 'Phase 1: Planning',
    tasks: [
      { name: 'Finalize Design', start: 0, end: 10, color: 'bg-blue-300' },
      { name: 'Get Permits', start: 10, end: 25, color: 'bg-blue-400' },
    ],
  },
  {
    category: 'Phase 2: Landscaping',
    tasks: [
      { name: 'Groundwork', start: 25, end: 35, color: 'bg-green-300' },
      { name: 'Planting', start: 35, end: 45, color: 'bg-green-400' },
      { name: 'Patio & Paths', start: 40, end: 55, color: 'bg-green-500' },
    ],
  },
  {
    category: 'Phase 3: Renovation',
    tasks: [
      { name: 'Demolition', start: 55, end: 60, color: 'bg-yellow-300' },
      { name: 'Plumbing & Electrical', start: 60, end: 75, color: 'bg-yellow-400' },
      { name: 'Drywall & Painting', start: 75, end: 90, color: 'bg-yellow-500' },
    ],
  },
  {
    category: 'Phase 4: Smart Upgrades',
    tasks: [
      { name: 'Install Devices', start: 85, end: 95, color: 'bg-purple-300' },
      { name: 'System Configuration', start: 95, end: 100, color: 'bg-purple-400' },
    ],
  },
];

const GanttChartBar: React.FC<{ task: { name: string; start: number; end: number; color: string } }> = ({ task }) => (
    <div
        className={`absolute h-8 ${task.color} rounded-md flex items-center px-2 text-xs text-black/70 shadow-sm`}
        style={{
            left: `${task.start}%`,
            width: `${task.end - task.start}%`,
        }}
    >
        {task.name}
    </div>
);

const ProjectTimeline: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 dark:text-gray-100">Project Timeline & Progress</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="mb-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Week 1</span>
                    <span>Week 4</span>
                    <span>Week 8</span>
                    <span>Week 12</span>
                </div>
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-4 bg-gradient-to-r from-sky-blue to-eco-green rounded-full" style={{ width: '70%' }}></div>
                    {/* Milestones */}
                    <div className="absolute top-0 w-1 h-6 bg-red-500 rounded-full" style={{ left: '25%' }} title="Permits Approved"></div>
                    <div className="absolute top-0 w-1 h-6 bg-red-500 rounded-full" style={{ left: '55%' }} title="Landscaping Complete"></div>
                    <div className="absolute top-0 w-1 h-6 bg-red-500 rounded-full" style={{ left: '90%' }} title="Renovation Complete"></div>
                </div>

                <div className="space-y-6">
                    {timelineData.map((categoryData, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-lg mb-2 dark:text-gray-200">{categoryData.category}</h3>
                            <div className="relative h-10 mb-2">
                                {categoryData.tasks.map((task, taskIndex) => (
                                    <GanttChartBar key={taskIndex} task={task} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 border-t dark:border-gray-700 pt-6">
                    <h3 className="font-semibold text-lg mb-4 dark:text-gray-200">Team Collaboration</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/id/1005/100/100" alt="Team member"/>
                            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/id/1011/100/100" alt="Team member"/>
                            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/id/1025/100/100" alt="Team member"/>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">3 contractors assigned. <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Manage Team</a></p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectTimeline;