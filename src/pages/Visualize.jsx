import React, { useState, useEffect } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function Visualize() {
  const [memory, setMemory] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('firstFit')
  const [blockSize, setBlockSize] = useState(100)
  const [totalMemory, setTotalMemory] = useState(1000)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeTab, setActiveTab] = useState('visualize')
  const [analytics, setAnalytics] = useState({
    totalAllocations: 0,
    totalDeallocations: 0,
    fragmentation: 0,
    utilization: 0,
    freeBlocks: 0,
    allocatedBlocks: 0,
    totalFreeSpace: 0,
    largestFreeBlock: 0
  })
  const [nextColorIndex, setNextColorIndex] = useState(0)
  const [animatingBlock, setAnimatingBlock] = useState(null)
  const [history, setHistory] = useState([])
  const [hoveredBlock, setHoveredBlock] = useState(null)

  // Predefined colors for memory blocks
  const blockColors = [
    'bg-indigo-600',
    'bg-pink-600',
    'bg-purple-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-teal-600',
    'bg-orange-600',
    'bg-cyan-600'
  ]

  // Initialize memory
  useEffect(() => {
    initializeMemory()
  }, [totalMemory])

  const initializeMemory = () => {
    setMemory([{
      start: 0,
      size: totalMemory,
      allocated: false,
      color: null
    }])
    setNextColorIndex(0)
    updateAnalytics()
  }

  const getNextColor = () => {
    const color = blockColors[nextColorIndex]
    setNextColorIndex((nextColorIndex + 1) % blockColors.length)
    return color
  }

  const updateAnalytics = () => {
    const allocatedBlocks = memory.filter(block => block.allocated)
    const freeBlocks = memory.filter(block => !block.allocated)
    const totalAllocated = allocatedBlocks.reduce((sum, block) => sum + block.size, 0)
    const totalFree = freeBlocks.reduce((sum, block) => sum + block.size, 0)
    const utilization = (totalAllocated / totalMemory) * 100
    const fragmentation = freeBlocks.length > 1 ? ((freeBlocks.length - 1) / memory.length) * 100 : 0

    setAnalytics(prev => ({
      ...prev,
      fragmentation,
      utilization,
      freeBlocks: freeBlocks.length,
      allocatedBlocks: allocatedBlocks.length,
      totalFreeSpace: totalFree,
      largestFreeBlock: Math.max(...freeBlocks.map(block => block.size), 0)
    }))

    setHistory(prev => {
      const newHistory = [...prev, {
        utilization,
        fragmentation,
        freeBlocks: freeBlocks.length,
        allocatedBlocks: allocatedBlocks.length
      }]
      // Keep only the last 20 entries
      return newHistory.slice(-20)
    })
  }

  const allocateMemory = (size) => {
    setIsAnimating(true)
    setAnimatingBlock({ type: 'allocate', size })
    
    setTimeout(() => {
      let newMemory = [...memory]
      let allocated = false

      switch (selectedAlgorithm) {
        case 'firstFit':
          allocated = firstFit(newMemory, size)
          break
        case 'bestFit':
          allocated = bestFit(newMemory, size)
          break
        case 'worstFit':
          allocated = worstFit(newMemory, size)
          break
      }

      if (allocated) {
        setMemory(newMemory)
        setAnalytics(prev => ({
          ...prev,
          totalAllocations: prev.totalAllocations + 1
        }))
        updateAnalytics()
      } else {
        alert('No suitable block found!')
      }
      
      setIsAnimating(false)
      setAnimatingBlock(null)
    }, 1000)
  }

  const deallocateMemory = (index) => {
    setIsAnimating(true)
    setAnimatingBlock({ type: 'deallocate', index })
    
    setTimeout(() => {
      const newMemory = [...memory]
      newMemory[index].allocated = false
      newMemory[index].color = null
      
      // Merge adjacent free blocks
      for (let i = 0; i < newMemory.length - 1; i++) {
        if (!newMemory[i].allocated && !newMemory[i + 1].allocated) {
          newMemory[i].size += newMemory[i + 1].size
          newMemory.splice(i + 1, 1)
          i--
        }
      }
      
      setMemory(newMemory)
      setAnalytics(prev => ({
        ...prev,
        totalDeallocations: prev.totalDeallocations + 1
      }))
      updateAnalytics()
      setIsAnimating(false)
      setAnimatingBlock(null)
    }, 1000)
  }

  const firstFit = (memory, size) => {
    for (let i = 0; i < memory.length; i++) {
      if (!memory[i].allocated && memory[i].size >= size) {
        if (memory[i].size > size + 10) {
          const newBlock = {
            start: memory[i].start + size,
            size: memory[i].size - size,
            allocated: false,
            color: null
          }
          memory.splice(i + 1, 0, newBlock)
        }
        memory[i].size = size
        memory[i].allocated = true
        memory[i].color = getNextColor()
        return true
      }
    }
    return false
  }

  const bestFit = (memory, size) => {
    let bestIndex = -1
    let bestSize = Infinity
    
    for (let i = 0; i < memory.length; i++) {
      if (!memory[i].allocated && memory[i].size >= size) {
        if (memory[i].size < bestSize) {
          bestSize = memory[i].size
          bestIndex = i
        }
      }
    }
    
    if (bestIndex !== -1) {
      if (memory[bestIndex].size > size + 10) {
        const newBlock = {
          start: memory[bestIndex].start + size,
          size: memory[bestIndex].size - size,
          allocated: false,
          color: null
        }
        memory.splice(bestIndex + 1, 0, newBlock)
      }
      memory[bestIndex].size = size
      memory[bestIndex].allocated = true
      memory[bestIndex].color = getNextColor()
      return true
    }
    return false
  }

  const worstFit = (memory, size) => {
    let worstIndex = -1
    let worstSize = -1
    
    for (let i = 0; i < memory.length; i++) {
      if (!memory[i].allocated && memory[i].size >= size) {
        if (memory[i].size > worstSize) {
          worstSize = memory[i].size
          worstIndex = i
        }
      }
    }
    
    if (worstIndex !== -1) {
      if (memory[worstIndex].size > size + 10) {
        const newBlock = {
          start: memory[worstIndex].start + size,
          size: memory[worstIndex].size - size,
          allocated: false,
          color: null
        }
        memory.splice(worstIndex + 1, 0, newBlock)
      }
      memory[worstIndex].size = size
      memory[worstIndex].allocated = true
      memory[worstIndex].color = getNextColor()
      return true
    }
    return false
  }

  const renderAnalytics = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#374151',
            font: { size: 12 }
          }
        },
        title: {
          display: true,
          color: '#374151',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#E5E7EB' },
          ticks: { color: '#374151' }
        },
        x: {
          grid: { color: '#E5E7EB' },
          ticks: { color: '#374151' }
        }
      }
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#374151',
            font: { size: 12 }
          }
        },
        title: {
          display: true,
          text: 'Memory Block Distribution',
          color: '#374151',
          font: { size: 14, weight: 'bold' }
        }
      }
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Utilization Over Time</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: history.map((_, i) => `Step ${i + 1}`),
                  datasets: [{
                    label: 'Utilization (%)',
                    data: history.map(h => h.utilization),
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fragmentation Over Time</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: history.map((_, i) => `Step ${i + 1}`),
                  datasets: [{
                    label: 'Fragmentation (%)',
                    data: history.map(h => h.fragmentation),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Memory Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <Pie
                data={{
                  labels: ['Allocated Blocks', 'Free Blocks'],
                  datasets: [{
                    data: [
                      memory.filter(b => b.allocated).length,
                      memory.filter(b => !b.allocated).length
                    ],
                    backgroundColor: ['#4F46E5', '#9CA3AF'],
                    borderWidth: 1
                  }]
                }}
                options={pieOptions}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Memory:</span>
                <span className="font-medium">{totalMemory} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Allocated Memory:</span>
                <span className="font-medium">
                  {memory.filter(b => b.allocated).reduce((sum, b) => sum + b.size, 0)} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Free Memory:</span>
                <span className="font-medium">
                  {memory.filter(b => !b.allocated).reduce((sum, b) => sum + b.size, 0)} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Number of Blocks:</span>
                <span className="font-medium">{memory.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Largest Free Block:</span>
                <span className="font-medium">
                  {Math.max(...memory.filter(b => !b.allocated).map(b => b.size))} units
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCppCode = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">C++ Implementation</h2>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-gray-100 font-mono">
{`#include <iostream>
#include <vector>
#include <algorithm>

struct MemoryBlock {
    int start;
    int size;
    bool allocated;
};

class MemoryManager {
private:
    std::vector<MemoryBlock> memory;
    int totalSize;

public:
    MemoryManager(int size) : totalSize(size) {
        memory.push_back({0, size, false});
    }

    bool firstFit(int size) {
        for (size_t i = 0; i < memory.size(); i++) {
            if (!memory[i].allocated && memory[i].size >= size) {
                if (memory[i].size > size + 10) {
                    MemoryBlock newBlock = {
                        memory[i].start + size,
                        memory[i].size - size,
                        false
                    };
                    memory.insert(memory.begin() + i + 1, newBlock);
                }
                memory[i].size = size;
                memory[i].allocated = true;
                return true;
            }
        }
        return false;
    }

    bool bestFit(int size) {
        size_t bestIndex = -1;
        int bestSize = INT_MAX;
        
        for (size_t i = 0; i < memory.size(); i++) {
            if (!memory[i].allocated && memory[i].size >= size) {
                if (memory[i].size < bestSize) {
                    bestSize = memory[i].size;
                    bestIndex = i;
                }
            }
        }
        
        if (bestIndex != -1) {
            if (memory[bestIndex].size > size + 10) {
                MemoryBlock newBlock = {
                    memory[bestIndex].start + size,
                    memory[bestIndex].size - size,
                    false
                };
                memory.insert(memory.begin() + bestIndex + 1, newBlock);
            }
            memory[bestIndex].size = size;
            memory[bestIndex].allocated = true;
            return true;
        }
        return false;
    }

    bool worstFit(int size) {
        size_t worstIndex = -1;
        int worstSize = -1;
        
        for (size_t i = 0; i < memory.size(); i++) {
            if (!memory[i].allocated && memory[i].size >= size) {
                if (memory[i].size > worstSize) {
                    worstSize = memory[i].size;
                    worstIndex = i;
                }
            }
        }
        
        if (worstIndex != -1) {
            if (memory[worstIndex].size > size + 10) {
                MemoryBlock newBlock = {
                    memory[worstIndex].start + size,
                    memory[worstIndex].size - size,
                    false
                };
                memory.insert(memory.begin() + worstIndex + 1, newBlock);
            }
            memory[worstIndex].size = size;
            memory[worstIndex].allocated = true;
            return true;
        }
        return false;
    }

    void deallocate(size_t index) {
        if (index < memory.size()) {
            memory[index].allocated = false;
            
            // Merge adjacent free blocks
            for (size_t i = 0; i < memory.size() - 1; i++) {
                if (!memory[i].allocated && !memory[i + 1].allocated) {
                    memory[i].size += memory[i + 1].size;
                    memory.erase(memory.begin() + i + 1);
                    i--;
                }
            }
        }
    }

    void printMemory() {
        for (const auto& block : memory) {
            std::cout << "Start: " << block.start 
                      << ", Size: " << block.size 
                      << ", Allocated: " << (block.allocated ? "Yes" : "No") 
                      << std::endl;
        }
    }
};`}
        </code>
      </pre>
    </div>
  )

  const renderMemoryBlock = (block, index) => {
    const blockInfo = {
      size: block.size,
      start: block.start,
      end: block.start + block.size,
      status: block.allocated ? 'Allocated' : 'Free',
      blockNumber: block.allocated ? `Block ${index + 1}` : 'Free Space'
    }

    return (
      <div
        key={index}
        className={`absolute h-full transition-all duration-500 transform group ${
          animatingBlock?.type === 'allocate' && animatingBlock?.size === block.size
            ? 'scale-105'
            : animatingBlock?.type === 'deallocate' && animatingBlock?.index === index
            ? 'scale-95 opacity-0'
            : ''
        } ${
          block.allocated ? block.color : 'bg-gray-700'
        }`}
        style={{
          left: `${(block.start / totalMemory) * 100}%`,
          width: `${(block.size / totalMemory) * 100}%`,
          cursor: block.allocated ? 'pointer' : 'default',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: `scale(${block.allocated ? 1.02 : 1})`,
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => block.allocated && deallocateMemory(index)}
      >
        {/* Hover Tooltip */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-75 text-white p-2 rounded-lg text-sm pointer-events-none transform group-hover:scale-110">
            <div className="font-medium mb-1">{blockInfo.blockNumber}</div>
            <div className="text-xs space-y-1">
              <div>Size: {blockInfo.size} units</div>
              <div>Start: {blockInfo.start}</div>
              <div>End: {blockInfo.end}</div>
              <div>Status: {blockInfo.status}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Memory Visualization</h1>
        
        {/* Control Panel */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Algorithm
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
              >
                <option value="firstFit">First Fit</option>
                <option value="bestFit">Best Fit</option>
                <option value="worstFit">Worst Fit</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Memory Size
              </label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={totalMemory}
                onChange={(e) => setTotalMemory(Number(e.target.value))}
                min="100"
                step="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Block Size to Allocate
              </label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={blockSize}
                onChange={(e) => setBlockSize(Number(e.target.value))}
                min="10"
                max={totalMemory}
                step="10"
              />
            </div>
            
            <div className="flex space-x-4 items-end">
              <button
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                onClick={() => allocateMemory(blockSize)}
                disabled={isAnimating}
              >
                Allocate
              </button>
              <button
                className="flex-1 bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={initializeMemory}
                disabled={isAnimating}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'visualize'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('visualize')}
            >
              Visualization
            </button>
            <button
              className={`${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`${
                activeTab === 'code'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('code')}
            >
              C++ Code
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'visualize' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Memory Layout</h2>
            
            <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
              {memory.map((block, index) => renderMemoryBlock(block, index))}
            </div>
            
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{totalMemory}</span>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-700 rounded mr-2" />
                <span className="text-sm text-gray-600">Free</span>
              </div>
              {memory.filter(block => block.allocated).map((block, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 ${block.color} rounded mr-2`} />
                  <span className="text-sm text-gray-600">Block {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'code' && renderCppCode()}
      </div>
    </div>
  )
}

export default Visualize 