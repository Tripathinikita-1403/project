
import React, { useState, useRef, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import { DownloadIcon } from './icons/IconComponents';

const gardenItems = [
    { id: 'tree', name: 'Tree', icon: '🌳', color: 'bg-green-800' },
    { id: 'lawn', name: 'Lawn', icon: '🟩', color: 'bg-green-500' },
    { id: 'patio', name: 'Patio', icon: '🪑', color: 'bg-yellow-600' },
    { id: 'path', name: 'Pathway', icon: '👣', color: 'bg-gray-400' },
    { id: 'flower', name: 'Flowers', icon: '🌷', color: 'bg-pink-400' },
    { id: 'pond', name: 'Pond', icon: '💧', color: 'bg-blue-500' },
];

const plantLibrary = [
    { name: 'Oak Tree', care: 'Full sun, moderate water.', season: 'Grows best in Spring/Summer.' },
    { name: 'Rose Bush', care: 'Full sun, regular watering and pruning.', season: 'Blooms late Spring to Fall.' },
    { name: 'Lavender', care: 'Full sun, well-drained soil.', season: 'Blooms in Summer.' },
];

const Garden3DPreview = forwardRef<HTMLDivElement, { grid: (typeof gardenItems[0] | null)[] }>(({ grid }, ref) => {
    const getItemStyle = (item: typeof gardenItems[0] | null) => {
      const baseStyle: React.CSSProperties = { 
          backgroundColor: '#8faa71', // Base ground color
          transform: 'translateZ(0px)',
          borderBottom: '2px solid #5d7a4a', // Darker bottom edge for depth
      };
      if (!item) return baseStyle;
  
      const styles: Record<string, React.CSSProperties> = {
        tree: { backgroundColor: '#166534', transform: 'translateZ(20px)', borderBottom: '2px solid #0d4b25'},
        lawn: { backgroundColor: '#22c55e', transform: 'translateZ(2px)', borderBottom: '2px solid #16a34a' },
        patio: { backgroundColor: '#ca8a04', transform: 'translateZ(1px)', borderBottom: '2px solid #a16207' },
        path: { backgroundColor: '#9ca3af', transform: 'translateZ(1px)', borderBottom: '2px solid #6b7280' },
        flower: { backgroundColor: '#f472b6', transform: 'translateZ(5px)', borderBottom: '2px solid #ec4899' },
        pond: { backgroundColor: '#3b82f6', transform: 'translateZ(-2px)', boxShadow: 'inset 0px 0px 5px rgba(0,0,0,0.4)', border: '1px solid #2563eb' },
      };
  
      return { ...baseStyle, ...(styles[item.id] || {}) };
    };
  
    return (
      <div className="w-full h-full flex items-center justify-center bg-sky-blue-light dark:bg-gray-900/50 rounded-md overflow-hidden p-4" style={{ perspective: '800px' }}>
        <div
          ref={ref}
          className="grid grid-cols-10 gap-px transition-transform duration-500 ease-in-out hover:scale-110 transform-gpu group"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(-30deg)', // Adjusted rotation for a better isometric-like view
            width: '250px',
            height: '250px',
          }}
        >
          {grid.map((cell, index) => (
            <div
              key={index}
              className="w-full h-full transition-all duration-300 flex items-center justify-center relative"
              style={{ ...getItemStyle(cell), transformStyle: 'preserve-3d' }}
            >
               {cell && (
                 <span 
                    className="text-base transition-transform duration-300" 
                    style={{ 
                        display: 'inline-block',
                        transform: 'rotateZ(30deg) rotateX(-60deg)', // Counter-rotate to make icons stand up
                        textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    }}
                 >
                    {cell.icon}
                 </span>
               )}
               {/* This div creates the "thickness" of the block */}
               <div className="absolute inset-0 bg-black/20" style={{ transform: 'translateZ(-2px)' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
});
Garden3DPreview.displayName = 'Garden3DPreview';

const GardenPlanner: React.FC = () => {
    const [grid, setGrid] = useState<(typeof gardenItems[0] | null)[]>(Array(100).fill(null));
    const [selectedItem, setSelectedItem] = useState(gardenItems[0]);
    const [waterUsage, setWaterUsage] = useState({ lawn: 50, plants: 20 });
    const gardenPreviewRef = useRef<HTMLDivElement>(null);

    const handleCellClick = (index: number) => {
        const newGrid = [...grid];
        if (newGrid[index]?.id === selectedItem.id) {
            newGrid[index] = null;
        } else {
            newGrid[index] = selectedItem;
        }
        setGrid(newGrid);
    };

    const handleDownloadImage = async () => {
        const element = gardenPreviewRef.current;
        if (!element) return;

        // Temporarily remove hover effect for a clean capture
        const hadHoverEffect = element.classList.contains('hover:scale-110');
        if (hadHoverEffect) {
            element.classList.remove('hover:scale-110');
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: null, // Use transparent background for the capture area
                scale: 2 // Increase resolution for better quality
            });
            const link = document.createElement('a');
            link.download = 'renova-garden-3d-view.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Failed to download image:", error);
        } finally {
             // Restore hover effect if it was there
            if (hadHoverEffect) {
                element.classList.add('hover:scale-110');
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Garden & Landscape Planner</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold mb-4 dark:text-gray-200">Design Your Space</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select an item from the toolbar and click on the grid to place it. Click again to remove.</p>
                    <div className="bg-eco-brown dark:bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-10 gap-1">
                            {grid.map((cell, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCellClick(index)}
                                    className={`w-full aspect-square cursor-pointer flex items-center justify-center text-xl ${cell ? cell.color : 'bg-green-200 dark:bg-green-900/50'}`}
                                >
                                    {cell ? cell.icon : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold dark:text-gray-200">3D Preview</h4>
                            <button
                                onClick={handleDownloadImage}
                                title="Download 3D View as Image"
                                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 bg-white dark:text-gray-300 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                        <div className="h-48 rounded-md flex items-center justify-center">
                            <Garden3DPreview grid={grid} ref={gardenPreviewRef} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 dark:text-gray-200">Toolbar</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {gardenItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`p-2 rounded-lg flex flex-col items-center border-2 transition-colors ${selectedItem.id === item.id ? 'border-eco-green-dark bg-eco-green-light dark:bg-gray-700' : 'border-transparent dark:hover:bg-gray-700'}`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-xs dark:text-gray-300">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 dark:text-gray-200">Plant Library</h3>
                        <ul className="space-y-3 text-sm">
                           {plantLibrary.map(plant => (
                               <li key={plant.name}>
                                   <strong className="text-eco-green-dark dark:text-eco-green">{plant.name}</strong>
                                   <p className="text-gray-600 dark:text-gray-400">{plant.care} {plant.season}</p>
                               </li>
                           ))}
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold mb-4 dark:text-gray-200">Irrigation & Water Estimator</h3>
                        <div className="space-y-2 text-sm dark:text-gray-300">
                            <p>Lawn Area: <strong>{waterUsage.lawn} gallons/week</strong></p>
                            <p>Plants & Flowers: <strong>{waterUsage.plants} gallons/week</strong></p>
                            <hr className="my-2 dark:border-gray-600"/>
                            <p>Total Estimated: <strong>{waterUsage.lawn + waterUsage.plants} gallons/week</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GardenPlanner;