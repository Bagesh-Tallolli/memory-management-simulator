import React, { useState } from 'react'

function Code() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('firstFit')

  const algorithms = {
    firstFit: {
      name: 'First Fit',
      code: `function firstFit(memory, size) {
  // Find the first free block that is large enough
  for (let i = 0; i < memory.length; i++) {
    if (!memory[i].allocated && memory[i].size >= size) {
      // Split block if it's too large
      if (memory[i].size > size + MIN_BLOCK_SIZE) {
        const newBlock = {
          start: memory[i].start + size,
          size: memory[i].size - size,
          allocated: false
        }
        memory.splice(i + 1, 0, newBlock)
      }
      
      // Allocate the block
      memory[i].size = size
      memory[i].allocated = true
      return i
    }
  }
  return -1 // No suitable block found
}`
    },
    bestFit: {
      name: 'Best Fit',
      code: `class MinHeap {
  constructor() {
    this.heap = []
  }

  insert(block) {
    this.heap.push(block)
    this.bubbleUp()
  }

  extractMin() {
    if (this.heap.length === 0) return null
    const min = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this.bubbleDown()
    }
    return min
  }

  bubbleUp() {
    let index = this.heap.length - 1
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[parentIndex].size <= this.heap[index].size) break
      [this.heap[parentIndex], this.heap[index]] = 
      [this.heap[index], this.heap[parentIndex]]
      index = parentIndex
    }
  }

  bubbleDown() {
    let index = 0
    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let smallest = index

      if (leftChild < this.heap.length && 
          this.heap[leftChild].size < this.heap[smallest].size) {
        smallest = leftChild
      }

      if (rightChild < this.heap.length && 
          this.heap[rightChild].size < this.heap[smallest].size) {
        smallest = rightChild
      }

      if (smallest === index) break

      [this.heap[index], this.heap[smallest]] = 
      [this.heap[smallest], this.heap[index]]
      index = smallest
    }
  }
}

function bestFit(memory, size) {
  const minHeap = new MinHeap()
  
  // Add all free blocks to the min heap
  memory.forEach((block, index) => {
    if (!block.allocated) {
      minHeap.insert({ ...block, index })
    }
  })

  // Find the smallest block that fits
  while (minHeap.heap.length > 0) {
    const block = minHeap.extractMin()
    if (block.size >= size) {
      // Split block if it's too large
      if (block.size > size + MIN_BLOCK_SIZE) {
        const newBlock = {
          start: block.start + size,
          size: block.size - size,
          allocated: false
        }
        memory.splice(block.index + 1, 0, newBlock)
      }
      
      // Allocate the block
      memory[block.index].size = size
      memory[block.index].allocated = true
      return block.index
    }
  }
  return -1 // No suitable block found
}`
    },
    worstFit: {
      name: 'Worst Fit',
      code: `class MaxHeap {
  constructor() {
    this.heap = []
  }

  insert(block) {
    this.heap.push(block)
    this.bubbleUp()
  }

  extractMax() {
    if (this.heap.length === 0) return null
    const max = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this.bubbleDown()
    }
    return max
  }

  bubbleUp() {
    let index = this.heap.length - 1
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[parentIndex].size >= this.heap[index].size) break
      [this.heap[parentIndex], this.heap[index]] = 
      [this.heap[index], this.heap[parentIndex]]
      index = parentIndex
    }
  }

  bubbleDown() {
    let index = 0
    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let largest = index

      if (leftChild < this.heap.length && 
          this.heap[leftChild].size > this.heap[largest].size) {
        largest = leftChild
      }

      if (rightChild < this.heap.length && 
          this.heap[rightChild].size > this.heap[largest].size) {
        largest = rightChild
      }

      if (largest === index) break

      [this.heap[index], this.heap[largest]] = 
      [this.heap[largest], this.heap[index]]
      index = largest
    }
  }
}

function worstFit(memory, size) {
  const maxHeap = new MaxHeap()
  
  // Add all free blocks to the max heap
  memory.forEach((block, index) => {
    if (!block.allocated) {
      maxHeap.insert({ ...block, index })
    }
  })

  // Find the largest block that fits
  while (maxHeap.heap.length > 0) {
    const block = maxHeap.extractMax()
    if (block.size >= size) {
      // Split block if it's too large
      if (block.size > size + MIN_BLOCK_SIZE) {
        const newBlock = {
          start: block.start + size,
          size: block.size - size,
          allocated: false
        }
        memory.splice(block.index + 1, 0, newBlock)
      }
      
      // Allocate the block
      memory[block.index].size = size
      memory[block.index].allocated = true
      return block.index
    }
  }
  return -1 // No suitable block found
}`
    }
  }

  const syntaxHighlight = (code) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/\b(function|class|return|if|while|for|const|let|var)\b/g, 
        '<span class="text-purple-600">$1</span>')
      .replace(/\b(new|this)\b/g, '<span class="text-yellow-600">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, 
        '<span class="text-orange-600">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-green-600">$1</span>')
      .replace(/([{}[\]()])/g, '<span class="text-gray-400">$1</span>')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Implementation Details</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {Object.entries(algorithms).map(([key, algo]) => (
                <button
                  key={key}
                  className={`px-6 py-4 text-sm font-medium ${
                    selectedAlgorithm === key
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAlgorithm(key)}
                >
                  {algo.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code
                className="text-sm text-gray-100 font-mono"
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(algorithms[selectedAlgorithm].code)
                }}
              />
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Code 