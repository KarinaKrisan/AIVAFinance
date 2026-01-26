import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Reports() {
  const { transactions } = useContext(FinanceContext);

  const dataByCategory = [
    { name: 'Necessidades', value: transactions.filter(t => t.category === 'necessidades').reduce((a, b) => a + b.amount, 0), color: '#10b981' },
    { name: 'Estilo', value: transactions.filter(t => t.category === 'estilo').reduce((a, b) => a + b.amount, 0), color: '#f59e0b' },
    { name: 'Dívidas', value: transactions.filter(t => t.category === 'dividas').reduce((a, b) => a + b.amount, 0), color: '#ef4444' },
    { name: 'Investimentos', value: transactions.filter(t => t.category === 'investimentos').reduce((a, b) => a + b.amount, 0), color: '#8b5cf6' },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Relatórios Detalhados 📊</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6">Gastos por Categoria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByCategory}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {dataByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Análise Numérica</h3>
          <div className="space-y-4">
             {dataByCategory.map(cat => (
                 <div key={cat.name} className="flex justify-between items-center border-b border-gray-50 pb-2">
                     <span className="text-sm text-gray-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></div>{cat.name}</span>
                     <span className="font-bold text-gray-800">R$ {cat.value.toLocaleString('pt-BR')}</span>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}