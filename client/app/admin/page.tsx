'use client'

import { useState } from 'react'
import { Plus, Check, X, Eye, Upload } from 'lucide-react'

const pendingProjects = [
  {
    id: 1,
    name: 'Madagascar Mangrove Restoration',
    submitter: '0x1234...5678',
    type: 'Ocean Conservation',
    requestedCredits: 500,
    documents: 3,
    submittedDate: '2024-01-10',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Kenya Solar Installation',
    submitter: '0x9876...4321',
    type: 'Renewable Energy',
    requestedCredits: 750,
    documents: 5,
    submittedDate: '2024-01-12',
    status: 'under_review'
  }
]

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('pending')
  const [showMintModal, setShowMintModal] = useState(false)
  const [mintForm, setMintForm] = useState({
    recipient: '',
    amount: '',
    projectId: '',
    vintage: '',
    certifier: ''
  })

  const handleApprove = (projectId: number) => {
    console.log('Approving project:', projectId)
    // Logique d'approbation
  }

  const handleReject = (projectId: number) => {
    console.log('Rejecting project:', projectId)
    // Logique de rejet
  }

  const handleMint = () => {
    console.log('Minting credits:', mintForm)
    setShowMintModal(false)
    setMintForm({
      recipient: '',
      amount: '',
      projectId: '',
      vintage: '',
      certifier: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-1">Manage carbon credit projects and token issuance</p>
        </div>
        <button
          onClick={() => setShowMintModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Mint Credits</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Projects ({pendingProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'approved'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved Projects
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Pending Projects Tab */}
      {activeTab === 'pending' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Verification Queue</h2>
          
          <div className="space-y-4">
            {pendingProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Submitter:</span>
                        <p>{project.submitter}</p>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <p>{project.type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Credits:</span>
                        <p>{project.requestedCredits} tCO2</p>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p>{project.submittedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Upload className="h-4 w-4" />
                    <span>{project.documents} documents uploaded</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-secondary flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="btn bg-red-100 hover:bg-red-200 text-red-700 flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="btn bg-green-100 hover:bg-green-200 text-green-700 flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mint Carbon Credits</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={mintForm.recipient}
                  onChange={(e) => setMintForm({...mintForm, recipient: e.target.value})}
                  className="input"
                  placeholder="0x..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (tCO2)
                </label>
                <input
                  type="number"
                  value={mintForm.amount}
                  onChange={(e) => setMintForm({...mintForm, amount: e.target.value})}
                  className="input"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={mintForm.projectId}
                  onChange={(e) => setMintForm({...mintForm, projectId: e.target.value})}
                  className="input"
                  placeholder="PROJ-001"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vintage
                  </label>
                  <input
                    type="text"
                    value={mintForm.vintage}
                    onChange={(e) => setMintForm({...mintForm, vintage: e.target.value})}
                    className="input"
                    placeholder="2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifier
                  </label>
                  <select
                    value={mintForm.certifier}
                    onChange={(e) => setMintForm({...mintForm, certifier: e.target.value})}
                    className="input"
                  >
                    <option value="">Select...</option>
                    <option value="Verra">Verra</option>
                    <option value="Gold Standard">Gold Standard</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMintModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleMint}
                className="btn btn-primary"
              >
                Mint Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}