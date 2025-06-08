import React, { useState } from 'react'

function Learn() {
  const [activeAccordion, setActiveAccordion] = useState(null)

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  const topics = [
    {
      title: 'What is Memory Management?',
      content: `Memory management is a crucial function of an operating system that handles the allocation and deallocation of memory blocks to various processes. It ensures efficient use of memory resources and prevents memory-related issues like fragmentation and memory leaks.

Key aspects of memory management include:
• Memory allocation
• Memory deallocation
• Memory protection
• Memory sharing
• Memory compaction`
    },
    {
      title: 'Memory Allocation Strategies',
      content: `There are several strategies for allocating memory to processes:

1. First Fit:
   - Allocates the first free block that is large enough
   - Fast but may lead to external fragmentation
   - Time Complexity: O(n)

2. Best Fit:
   - Allocates the smallest free block that is large enough
   - Minimizes wasted space but may lead to external fragmentation
   - Uses Min-Heap for efficient implementation
   - Time Complexity: O(log n)

3. Worst Fit:
   - Allocates the largest free block available
   - Reduces external fragmentation but may waste large blocks
   - Uses Max-Heap for efficient implementation
   - Time Complexity: O(log n)`
    },
    {
      title: 'Understanding Fragmentation',
      content: `Fragmentation occurs when memory blocks are allocated and deallocated, leaving small gaps that are too small to be used effectively.

Types of Fragmentation:

1. Internal Fragmentation:
   - Occurs when allocated memory is larger than requested
   - Wasted space within allocated blocks
   - Common in fixed-size allocation

2. External Fragmentation:
   - Occurs when free memory is scattered in small blocks
   - Total free memory is sufficient but not contiguous
   - Can be reduced through memory compaction`
    },
    {
      title: 'Heap Data Structures in Memory Management',
      content: `Min-Heap and Max-Heap are crucial data structures used in memory management:

1. Min-Heap (Best Fit):
   - Maintains free blocks sorted by size
   - Root always contains the smallest free block
   - Efficient for finding the best fit
   - Operations: O(log n)

2. Max-Heap (Worst Fit):
   - Maintains free blocks sorted by size
   - Root always contains the largest free block
   - Efficient for finding the worst fit
   - Operations: O(log n)

Both heaps help optimize the allocation process by providing efficient access to the most suitable memory blocks.`
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Memory Management Concepts</h1>
        
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">{topic.title}</h2>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeAccordion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {activeAccordion === index && (
                <div className="px-6 pb-4">
                  <div className="prose prose-indigo max-w-none">
                    {topic.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-600 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Learn 