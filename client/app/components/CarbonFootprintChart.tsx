'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', footprint: 15.2, offset: 10.5 },
  { month: 'Feb', footprint: 14.8, offset: 12.1 },
  { month: 'Mar', footprint: 16.1, offset: 11.8 },
  { month: 'Apr', footprint: 13.9, offset: 14.2 },
  { month: 'May', footprint: 12.7, offset: 15.1 },
  { month: 'Jun', footprint: 11.8, offset: 16.3 }
]

 const CarbonFootprintChart = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Carbon Footprint Trend</h3>
        <select className="input w-32 text-sm">
          <option>Last 6M</option>
          <option>Last 1Y</option>
          <option>All Time</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="footprint" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Carbon Footprint (t CO2)"
          />
          <Line 
            type="monotone" 
            dataKey="offset" 
            stroke="#22c55e" 
            strokeWidth={2}
            name="Offset Credits (t CO2)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CarbonFootprintChart;