function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About MemSim</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              MemSim is an educational tool designed to help students understand memory management concepts in operating systems.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Features</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Interactive visualization of memory allocation</li>
              <li>Multiple allocation strategies (First Fit, Best Fit, Worst Fit, Next Fit)</li>
              <li>Real-time process queue management</li>
              <li>Educational content about memory management algorithms</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Memory Allocation Strategies</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">First Fit</h4>
                <p className="text-gray-600">Allocates the first free block that is large enough to accommodate the process.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Best Fit</h4>
                <p className="text-gray-600">Allocates the smallest free block that is large enough to accommodate the process.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Worst Fit</h4>
                <p className="text-gray-600">Allocates the largest free block available.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Next Fit</h4>
                <p className="text-gray-600">Similar to First Fit, but starts searching from the last allocated position.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 