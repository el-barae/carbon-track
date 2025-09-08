"use client"

import { useEffect, useState } from "react";

interface TransactionsSectionProps {
  transactions: any[];
}

export default function TransactionsSection({ transactions }: TransactionsSectionProps) {
  const [clientTransactions, setClientTransactions] = useState<any[]>([]);

  useEffect(() => {
    setClientTransactions(transactions);
  }, [transactions]);

  const totalVolume = clientTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2);
  const totalTransactions = clientTransactions.length;
  const purchases = clientTransactions.filter((tx) => tx.buyer === tx.wallet).length;
  const sales = clientTransactions.filter((tx) => tx.seller === tx.wallet).length;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">📊 Transaction History</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">API Service</div>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {clientTransactions.length} Total
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">GET /transactions/:wallet</div>

      {!clientTransactions.length ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <div className="text-gray-500 font-medium mb-2">No transactions yet</div>
          <div className="text-sm text-gray-400">
            Your trading activity will appear here once you start buying or selling credits
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-blue-600 font-medium">Total Transactions</div>
              <div className="text-xl font-bold text-blue-800">{totalTransactions}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-600 font-medium">Total Volume</div>
              <div className="text-xl font-bold text-green-800">
                {totalVolume} tCO₂
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-purple-600 font-medium">Purchases</div>
              <div className="text-xl font-bold text-purple-800">
                {purchases}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-orange-600 font-medium">Sales</div>
              <div className="text-xl font-bold text-orange-800">
                {sales}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            {clientTransactions.slice().reverse().map((tx: any, index) => {
              const uniqueKey = tx.id || `${tx.creditId}-${tx.createdAt}-${index}`;
              // const createdAt = new Date(tx.createdAt);

              return (
                <div key={uniqueKey} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          Credit #{tx.creditId}
                        </div>
                        <div className="text-sm font-medium text-gray-800">{tx.value} tCO₂</div>
                        {/* <div className="text-xs text-gray-500">{createdAt.toLocaleDateString()}</div> */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500 font-medium">From (Seller)</div>
                          <div className="font-mono text-xs text-gray-700 break-all">{tx.from}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium">To (Buyer)</div>
                          <div className="font-mono text-xs text-gray-700 break-all">{tx.to}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        {/* <div className="text-sm font-medium text-gray-600">{createdAt.toLocaleTimeString()}</div> */}
                        <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
