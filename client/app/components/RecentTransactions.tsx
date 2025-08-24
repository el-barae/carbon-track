'use client'

import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'

const transactions = [
  {
    id: 1,
    type: 'buy',
    amount: 25.5,
    project: 'Amazon Forest Conservation',
    price: '$15.30',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'retire',
    amount: 10.0,
    project: 'Solar Farm Texas',
    price: '$12.80',
    date: '2024-01-14',
    status: 'completed'
  },
  {
    id: 3,
    type: 'buy',
    amount: 50.0,
    project: 'Wind Energy Project',
    price: '$18.50',
    date: '2024-01-13',
    status: 'pending'
  }
]

const RecentTransactions = () => {
  const getIcon = (type: string) => {
    if (type === 'buy') return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    if (type === 'retire') return <ArrowUpRight className="h-4 w-4 text-blue-600" />
    return <Clock className="h-4 w-4 text-gray-600" />
  }

  const getTypeLabel = (type: string) => {
    if (type === 'buy') return 'Purchase'
    if (type === 'retire') return 'Retire'
    return 'Transfer'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-full">
                {getIcon(tx.type)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{getTypeLabel(tx.type)}</p>
                <p className="text-sm text-gray-600">{tx.project}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{tx.amount} CO2</p>
              <p className="text-sm text-gray-600">{tx.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions;