import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X, ShieldCheck } from 'lucide-react';

export default function EmergencyModal({ onClose }) {
  const { transactions, bills, goals } = useContext(FinanceContext);

  const essentialExpenses = transactions
    .filter(t => t.category === 'necessidades')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const fixedBills = bills
    .filter(b => ['Moradia', 'Saúde', 'Educação', 'Transporte', 'Mercado'].includes(b.category))
    .reduce((acc, curr) => acc + curr.valueRaw, 0);

  const monthlyCost = (essentialExpenses + fixedBills) || 0;
  
  const target6Months = monthlyCost * 6;
  const target12Months = monthlyCost * 12;

  const currentReserve = goals
    .filter(g => g.name.toLowerCase().includes('reserva') || g.name.toLowerCase().includes('emergência'))
    .reduce((acc, curr) => acc + curr.currentAmount, 0);

  const progress = target6Months > 0 ? (currentReserve / target6Months) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ShieldCheck className="text-emerald-600"/> Reserva de Emergência</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl mb-6 text-center border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Custo de Vida Essencial (Mensal)</p>
          <h3 className="text-3xl font-bold text-gray-800">R$ {monthlyCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-100 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Meta 6 meses</p>
            <p className="text-lg font-bold text-emerald-600">R$ {target6Months.toLocaleString('pt-BR')}</p>
          </div>
          <div className="border border-gray-100 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Meta 12 meses</p>
            <p className="text-lg font-bold text-blue-600">R$ {target12Months.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-emerald-700">Progresso (6 meses)</span>
            <span className="text-emerald-600 font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-2 border border-emerald-100">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min(progress, 100)}%`}}></div>
          </div>
          <p className="text-xs text-emerald-700">
            Saldo atual: <b>R$ {currentReserve.toLocaleString('pt-BR')}</b> (nas caixinhas "Reserva").
          </p>
        </div>
      </div>
    </div>
  );
}