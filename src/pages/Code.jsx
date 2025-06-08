import React, { useState } from 'react'

const Code = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('firstFit')

  const firstFitCode = `#include <iostream>
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
};`

  const bestFitCode = `#include <iostream>
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
};`

  const worstFitCode = `#include <iostream>
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
};`

  const getCode = () => {
    switch (selectedAlgorithm) {
      case 'firstFit':
        return firstFitCode;
      case 'bestFit':
        return bestFitCode;
      case 'worstFit':
        return worstFitCode;
      default:
        return firstFitCode;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">C++ Implementation</h1>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="firstFit">First Fit</option>
              <option value="bestFit">Best Fit</option>
              <option value="worstFit">Worst Fit</option>
            </select>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-100 font-mono">{getCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Code 