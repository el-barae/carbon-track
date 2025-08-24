'use client'

import { useState } from 'react'
import { Search, Filter, Star, Leaf, Shield, TrendingUp } from 'lucide-react'

const creditProjects = [
  {
    id: 1,
    name: 'Amazon Rainforest Conservation',
    location: 'Brazil',
    type: 'Forest Conservation',
    certifier: 'Verra',
    vintage: '2024',
    price: 15.30,
    available: 1250,
    rating: 4.8,
    verified: true,
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Texas Solar Farm Project',
    location: 'Texas, USA',
    type: 'Renewable Energy',
    certifier: 'Gold Standard',
    vintage: '2023',
    price: 12.80,
    available: 850,
    rating: 4.6,
    verified: true,
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    name: 'Direct Air Capture Facility',
    location: 'Iceland',
    type: 'Direct Air Capture',
    certifier: 'Verra',
    vintage: '2024',
    price: 85.00,
    available: 200,
    rating: 4.9,
    verified: true,
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    name: 'Ocean Blue Carbon Project',
    location: 'Australia',
    type: 'Ocean Conservation',
    certifier: 'Gold Standard',
    vintage: '2023',
    price: 22.50,
    available: 500,
    rating: 4.7,
    verified: true,
    image: '/api/placeholder/300/200'
  }
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('price-low')

  const filteredProjects = creditProjects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === 'all' || project.type === selectedType)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        default: return 0
      }
    })

  const ProjectCard = ({ project }: { project: typeof creditProjects[0] }) => (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
          <Leaf className="h-16 w-16 text-white opacity-50" />
        </div>
        {project.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
          <p className="text-gray-600 text-sm">{project.location}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {project.type}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{project.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Certifier: {project.certifier}</span>
          <span>Vintage: {project.vintage}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">${project.price}</p>
              <p className="text-sm text-gray-600">per tonne CO2</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{project.available}</p>
              <p className="text-sm text-gray-600">available</p>
            </div>
          </div>
          
          <button className="w-full btn btn-primary">
            Buy Credits
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
        <p className="text-gray-600 mt-2">Discover and purchase verified carbon credits from around the world</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="Forest Conservation">Forest Conservation</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Direct Air Capture">Direct Air Capture</option>
              <option value="Ocean Conservation">Ocean Conservation</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}