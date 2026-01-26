import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Bell, Trash2, Plus, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

export default function AlertSystem() {
  const { alerts, addAlert, deleteAlert } = useContext(FinanceContext);
  
  const [type, setType] = useState('');
  const [value, setValue] = useState('');

  // --- CONFIGURAÇÃO DOS NOMES DOS ALERTAS (ATUALIZADO) ---
  const alertTypes = [
    { 
      id: 'gasto_alto', // Mantive o ID técnico para não quebrar o banco
      label: 'Gasto Excedido', 
      icon: <TrendingUp size={18}/>, 
      suffix: 'Avisar se o total de gastos passar de' 
    },
    { 
      id: 'fatura_cartao', 
      label: 'Conta Alta', 
      icon: <AlertTriangle size={18}/>, 
      suffix: 'Avisar se chegar uma conta maior que' 
    },
    { 
      id: 'saldo_baixo', 
      label: 'Saldo Crítico', 
      icon: <Wallet size={18}/>, 
      suffix: 'Avisar se meu saldo cair para menos de' 
    },
  ];

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!type || !value) return;

    addAlert({
      type,
      value: Number(value),
      createdAt: new Date().toISOString(),
      active: true
    });

    setType('');
    setValue('');
  };

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Bell size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Meus Alertas</h1>
            <p className="text-sm text-gray-500">Defina limites para ser notificado.</p>
        </div>
      </div>

      {/* Formulário de Criação */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-emerald-500"/> Novo Alerta
        </h2>
        
        <form onSubmit={handleAddAlert} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tipo de Regra</label>
                <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    className="w-full mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none text-gray-700"
                >
                    <option value="" disabled>Selecione o tipo...</option>
                    {alertTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                </select>
            </div>

            {type && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        {alertTypes.find(t => t.id === type)?.suffix} (R$)
                    </label>
                    <input 
                        type="number" 
                        placeholder="0,00" 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)} 
                        className="w-full mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none font-bold text-lg text-gray-800"
                    />
                </div>
            )}

            <button 
                type="submit" 
                disabled={!type || !value}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition"
            >
                Salvar Regra
            </button>
        </form>
      </div>

      {/* Lista de Alertas Configurados */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-4">
            Regras Ativas ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <Bell size={32} className="text-gray-300 mb-2"/>
                <p className="text-gray-400 font-medium">Nenhum alerta configurado.</p>
                <p className="text-xs text-gray-400">Crie uma regra acima para começar.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map(alert => {
                    const alertConfig = alertTypes.find(t => t.id === alert.type) || { label: 'Outro', icon: <Bell/> };
                    
                    return (
                        <div key={alert.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-50 text-orange-500 p-3 rounded-xl">
                                    {alertConfig.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{alertConfig.label}</h4>
                                    <p className="text-xs text-gray-500">
                                        Limite definido: <span className="font-bold text-gray-700">{formatCurrency(alert.value)}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => deleteAlert(alert.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Excluir Alerta"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

    </div>
  );
}