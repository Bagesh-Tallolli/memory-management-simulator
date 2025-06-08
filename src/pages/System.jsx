import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const System = () => {
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if running on localhost
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocalhost) {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3001/system-info');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setMemoryInfo(data.memory);
          setProcesses(data.processes);
          setError(null);
          
          // Update history
          setHistory(prev => {
            const newHistory = [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              used: data.memory.used,
              free: data.memory.free,
              total: data.memory.total
            }].slice(-20); // Keep last 20 entries
            return newHistory;
          });
        } catch (error) {
          console.error('Error fetching system info:', error);
          setError('Failed to connect to system information server. Please make sure the server is running.');
        }
        setIsLoading(false);
      };

      // Initial fetch
      fetchData();

      // Set up polling every 2 seconds
      const interval = setInterval(fetchData, 2000);

      return () => clearInterval(interval);
    }
  }, [isLocalhost]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Memory Usage Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Memory (GB)'
        }
      }
    }
  };

  if (!isLocalhost) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">System Memory Visualization</h1>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-lg font-medium text-gray-900">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-600">
              This feature is only available when running the application locally.
              Please run the application on localhost to view real-time system memory information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading system information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-600 mb-2">To fix this:</p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Open a new terminal window</li>
                <li>Navigate to the project directory</li>
                <li>Run <code className="bg-gray-200 px-2 py-1 rounded">node server.js</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Waiting for system information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Memory Usage Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Memory Usage</h2>
            <div className="h-64">
              <Line
                data={{
                  labels: history.map(h => h.timestamp),
                  datasets: [
                    {
                      label: 'Used Memory',
                      data: history.map(h => h.used / 1024 / 1024 / 1024), // Convert to GB
                      borderColor: '#4F46E5',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      fill: true
                    },
                    {
                      label: 'Free Memory',
                      data: history.map(h => h.free / 1024 / 1024 / 1024), // Convert to GB
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      fill: true
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Memory Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Memory Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Memory:</span>
                <span className="font-medium">{(memoryInfo.total / 1024 / 1024 / 1024).toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Used Memory:</span>
                <span className="font-medium">{(memoryInfo.used / 1024 / 1024 / 1024).toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Free Memory:</span>
                <span className="font-medium">{(memoryInfo.free / 1024 / 1024 / 1024).toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">{((memoryInfo.used / memoryInfo.total) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Memory Processes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Memory Processes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processes.slice(0, 10).map((process, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(process.mem / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.cpu.toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.pid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System; 