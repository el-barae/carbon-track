'use client'

import { useState } from 'react'
import { Calculator, Zap, Car, Plane, Home } from 'lucide-react'

export default function CarbonCalculator() {
  const [formData, setFormData] = useState({
    electricity: '',
    gas: '',
    carMiles: '',
    flightHours: '',
    diet: 'mixed'
  })
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateFootprint = async () => {
    setLoading(true)
    
    // Simulation du calcul
    setTimeout(() => {
      const electricity = parseFloat(formData.electricity) || 0
      const gas = parseFloat(formData.gas) || 0
      const carMiles = parseFloat(formData.carMiles) || 0
      const flightHours = parseFloat(formData.flightHours) || 0
      
      const electricityFootprint = electricity * 0.4 // kg CO2 per kWh
      const gasFootprint = gas * 2.2 // kg CO2 per cubic meter
      const carFootprint = carMiles * 0.2 // kg CO2 per mile
      const flightFootprint = flightHours * 90 // kg CO2 per hour
      
      const totalFootprint = (electricityFootprint + gasFootprint + carFootprint + flightFootprint) / 1000
      setResult(totalFootprint)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Carbon Footprint Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate your annual carbon emissions and find ways to offset them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Carbon Calculator
          </h2>

          <div className="space-y-6">
            {/* Energy Consumption */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Energy Consumption (Annual)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Electricity (kWh/year)
                  </label>
                  <input
                    type="number"
                    name="electricity"
                    value={formData.electricity}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 12000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Natural Gas (m³/year)
                  </label>
                  <input
                    type="number"
                    name="gas"
                    value={formData.gas}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 800"
                  />
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2 text-blue-500" />
                Transportation (Annual)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Miles Driven
                  </label>
                  <input
                    type="number"
                    name="carMiles"
                    value={formData.carMiles}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Plane className="h-4 w-4 mr-1 text-gray-500" />
                    Flight Hours
                  </label>
                  <input
                    type="number"
                    name="flightHours"
                    value={formData.flightHours}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateFootprint}
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? 'Calculating...' : 'Calculate My Footprint'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result !== null && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Carbon Footprint</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {result.toFixed(1)} <span className="text-lg">tonnes CO2/year</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Global average is 4.8 tonnes per person
                </p>
                
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Offset Recommendation</p>
                  <p className="text-sm text-gray-600">
                    Purchase {Math.ceil(result)} carbon credits to become carbon neutral
                  </p>
                  <button className="mt-3 btn btn-primary">
                    Buy Credits Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Reduce Your Footprint</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Home className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Switch to Renewable Energy</p>
                  <p className="text-sm text-green-700">Use solar panels or green energy providers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Car className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Reduce Car Usage</p>
                  <p className="text-sm text-blue-700">Walk, bike, or use public transportation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <Plane className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-800">Fly Less</p>
                  <p className="text-sm text-purple-700">Consider virtual meetings or train travel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
