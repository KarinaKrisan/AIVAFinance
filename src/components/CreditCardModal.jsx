import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X, CreditCard, Plus, Trash2 } from 'lucide-react';

export default function CreditCardModal({ onClose }) {
  const { cards, addCard, deleteCard } = useContext(FinanceContext);
  const [form, setForm] = useState({ name: '', closingDay: '', dueDay: '', limit: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.closingDay) return;
    addCard({ ...form, limit: Number(form.limit) || 0 });
    setForm({ name: '', closingDay: '', dueDay: '', limit: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><CreditCard size={24} className="text-purple-600"/> Meus Cartões</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-2xl mb-6">
          <div className="mb-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Nome do Cartão</label>
            <input type="text" placeholder="Ex: Nubank" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white p-2 rounded-lg border border-gray-200 mt-1 outline-none"/>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Dia Fecha</label>
              <input type="number" placeholder="05" max="31" value={form.closingDay} onChange={e => setForm({...form, closingDay: e.target.value})} className="w-full bg-white p-2 rounded-lg border border-gray-200 mt-1 outline-none"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Dia Vence</label>
              <input type="number" placeholder="12" max="31" value={form.dueDay} onChange={e => setForm({...form, dueDay: e.target.value})} className="w-full bg-white p-2 rounded-lg border border-gray-200 mt-1 outline-none"/>
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition"><Plus size={18}/> Adicionar</button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cards.length === 0 && <p className="text-center text-sm text-gray-400">Nenhum cartão cadastrado.</p>}
          {cards.map(card => (
            <div key={card.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><CreditCard size={18}/></div>
                <div>
                  <p className="font-bold text-sm text-gray-700">{card.name}</p>
                  <p className="text-[10px] text-gray-400">Fecha dia {card.closingDay} • Vence dia {card.dueDay}</p>
                </div>
              </div>
              <button onClick={() => deleteCard(card.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}