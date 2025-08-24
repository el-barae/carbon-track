'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const portfolioData = [
  { name: 'Forest Conservation', value: 45, color: '#22c55e' },
  { name: 'Renewable Energy', value: 30, color: '#3b82f6' },
  { name: 'Direct Air Capture', value: 15, color: '#f59e0b' },
  { name: 'Ocean Projects', value: 10, color: '#8b5cf6' }
]

 const CreditPortfolio = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Portfolio</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={portfolioData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {portfolioData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {portfolioData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreditPortfolio;