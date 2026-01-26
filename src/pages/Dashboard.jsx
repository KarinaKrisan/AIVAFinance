import React, { useState, useContext } from 'react';
import { 
  Wallet, TrendingDown, PiggyBank, Plus, X, Trash2, Edit2, 
  Landmark, Banknote, CreditCard, Target, ArrowRight, 
  Receipt, Calendar, CheckCircle, Clock, Bus, ShieldCheck, MessageCircle 
} from 'lucide-react';
import { FinanceContext } from '../context/FinanceContext';
import CreditCardModal from '../components/CreditCardModal';
import EmergencyModal from '../components/EmergencyModal';
import TelegramModal from '../components/TelegramModal';

export default function Dashboard() {
  const { 
    transactions, incomeList, goals, bills, currentDate, cards,
    addTransaction, deleteTransaction, addIncome, deleteIncome,
    addGoal, deleteGoal, updateGoalAmount, addBill, deleteBill, updateBillStatus
  } = useContext(FinanceContext);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // ESTADOS
  const [form, setForm] = useState({ category: 'necessidades', paymentMethod: 'Pix', amountRaw: '', amountDisplay: '', description: '', installments: '1', cardId: '' });
  const [incomeForm, setIncomeForm] = useState({ name: '', type: 'Salário', amountRaw: '', amountDisplay: '' });
  const [goalForm, setGoalForm] = useState({ name: '', targetRaw: '', targetDisplay: '', currentRaw: 0, icon: '💰' });
  const [depositForm, setDepositForm] = useState({ goalId: '', amountRaw: '', amountDisplay: '' });
  const [billForm, setBillForm] = useState({ name: '', valueRaw: '', valueDisplay: '', dueDate: '', category: '', notes: '', isRecurring: false, cardId: '' });
  const [transportForm, setTransportForm] = useState({ dailyCostRaw: '', dailyCostDisplay: '', days: '' });

  const formatCurrencyInput = (value) => {
    const numbers = value.replace(/\D/g, "");
    const rawValue = Number(numbers) / 100;
    const displayValue = rawValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return { raw: rawValue, display: displayValue };
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };
  
  const mapBillToDistribution = (billCategory) => {
    const map = { 
        'Moradia': 'necessidades', 'Transporte': 'necessidades', 'Saúde': 'necessidades', 'Educação': 'necessidades', 'Mercado': 'necessidades', 'Estudos': 'necessidades',
        'Lazer': 'estilo', 'Beleza': 'estilo', 'Compras': 'estilo', 'Streaming': 'estilo', 'iFood/Restaurante': 'estilo', 'Despesas Eventuais': 'estilo', 'Outros': 'estilo',
        'Cartão de Crédito': 'dividas', 'Empréstimo': 'dividas', 'Financiamento': 'dividas'
    };
    return map[billCategory] || 'estilo';
  };
  
  const categoriesConfig = [
    { id: 'necessidades', label: 'Necessidades', metaPercent: 50, color: 'emerald', emoji: '🏠' },
    { id: 'estilo', label: 'Estilo de Vida', metaPercent: 30, color: 'amber', emoji: '✨' },
    { id: 'dividas', label: 'Dívidas', metaPercent: 5, color: 'red', emoji: '💸' },
    { id: 'reserva', label: 'Reserva', metaPercent: 5, color: 'yellow', emoji: '💰' },
    { id: 'investimentos', label: 'Investimentos', metaPercent: 10, color: 'violet', emoji: '📈' },
  ];

  // FILTROS E CÁLCULOS
  const filteredTransactions = transactions.filter(t => {
      const [day, month, year] = t.date.split('/');
      return parseInt(month) === currentDate.getMonth() + 1 && parseInt(year) === currentDate.getFullYear();
  });
  const filteredBills = bills.filter(b => {
    if (!b.dueDate) return false;
    const [year, month, day] = b.dueDate.split('-'); 
    const billDate = new Date(year, month - 1, day);
    return billDate.getMonth() === currentDate.getMonth() && billDate.getFullYear() === currentDate.getFullYear();
  });

  const totalRenda = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
  const sumTransactions = filteredTransactions.filter(t => t.category !== 'investimentos' && t.category !== 'reserva').reduce((acc, curr) => acc + curr.amount, 0);
  const sumPaidBills = filteredBills.filter(b => b.status === 'paid').reduce((acc, curr) => acc + curr.valueRaw, 0);
  const totalGastoReal = sumTransactions + sumPaidBills;
  const saldo = totalRenda - (filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0) + sumPaidBills);
  const totalContasPendente = filteredBills.filter(b => b.status === 'pending').reduce((acc, curr) => acc + curr.valueRaw, 0);
  const qtdContasPagas = filteredBills.filter(b => b.status === 'paid').length;
  const qtdContasPendentes = filteredBills.filter(b => b.status === 'pending').length;

  const handleSubmitIncome = (e) => { 
      e.preventDefault(); 
      if (!incomeForm.amountRaw) return; 
      const finalName = incomeForm.name ? `${incomeForm.type} - ${incomeForm.name}` : incomeForm.type;
      addIncome({ name: finalName, source: 'Manual', amount: incomeForm.amountRaw }); 
      setIncomeForm({ name: '', type: 'Salário', amountRaw: '', amountDisplay: '' }); 
      setIsIncomeModalOpen(false);
  };
  
  const handleSubmitTransaction = (e) => { 
      e.preventDefault(); 
      if (!form.amountRaw) return; 
      const selectedCard = cards.find(c => c.id === form.cardId);
      const cardName = selectedCard ? selectedCard.name : '';
      addTransaction({ 
          category: form.category, paymentMethod: form.paymentMethod, amount: form.amountRaw, 
          description: form.description || 'Sem descrição', date: new Date().toLocaleDateString('pt-BR'),
          installments: form.paymentMethod === 'Cartão de Crédito' ? Number(form.installments) : 1,
          cardId: form.cardId, cardName: cardName
      }); 
      setForm({ category: 'necessidades', paymentMethod: 'Pix', amountRaw: '', amountDisplay: '', description: '', installments: '1', cardId: '' }); 
      setIsTransactionModalOpen(false); 
  };
  
  const handleCreateBill = (e) => { 
      e.preventDefault(); 
      if (!billForm.name || !billForm.valueRaw) return; 
      const selectedCard = cards.find(c => c.id === billForm.cardId);
      const cardName = selectedCard ? selectedCard.name : '';
      addBill({ ...billForm, status: 'pending', cardId: billForm.cardId, cardName: cardName }); 
      setBillForm({ name: '', valueRaw: '', valueDisplay: '', dueDate: '', category: '', notes: '', isRecurring: false, cardId: '' }); 
      setIsBillModalOpen(false); 
  };

  const handleCreateGoal = (e) => { e.preventDefault(); if (!goalForm.name) return; addGoal({ name: goalForm.name, targetAmount: goalForm.targetRaw || 0, currentAmount: 0, icon: goalForm.icon }); setGoalForm({ name: '', targetRaw: '', targetDisplay: '', currentRaw: 0, icon: '💰' }); setIsGoalModalOpen(false); };
  const handleDepositSubmit = (e) => { e.preventDefault(); if (!depositForm.goalId || !depositForm.amountRaw) return; updateGoalAmount(depositForm.goalId, depositForm.amountRaw); const goalName = goals.find(g => g.id === depositForm.goalId)?.name || 'Caixinha'; addTransaction({ category: 'investimentos', paymentMethod: 'Transferência', amount: depositForm.amountRaw, description: `Depósito: ${goalName}`, date: new Date().toLocaleDateString('pt-BR') }); setDepositForm({ goalId: '', amountRaw: '', amountDisplay: '' }); setIsDepositModalOpen(false); };
  const handleCreateTransportExpense = (e) => { e.preventDefault(); if (!transportForm.dailyCostRaw || !transportForm.days) return; const totalTransport = transportForm.dailyCostRaw * Number(transportForm.days); const totalDisplay = totalTransport.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); const year = currentDate.getFullYear(); const month = String(currentDate.getMonth() + 1).padStart(2, '0'); addBill({ name: 'Transporte Mensal', valueRaw: totalTransport, valueDisplay: totalDisplay, dueDate: `${year}-${month}-01`, category: 'Transporte', notes: `${transportForm.days} dias x ${transportForm.dailyCostDisplay}`, isRecurring: false, status: 'pending' }); setTransportForm({ dailyCostRaw: '', dailyCostDisplay: '', days: '' }); setIsTransportModalOpen(false); };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative text-gray-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div className="flex gap-2 flex-wrap">
            <button onClick={() => setIsCardModalOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-xl transition"><CreditCard size={16} /> Meus Cartões</button>
            <button onClick={() => setIsEmergencyModalOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl transition"><ShieldCheck size={16} /> Reserva</button>
            <button onClick={() => setIsTelegramModalOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl transition"><MessageCircle size={16} /> Bot Telegram</button>
         </div>
      </div>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => setIsIncomeModalOpen(true)} className="bg-emerald-500 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden text-left hover:scale-[1.02] transition"><span className="text-xs font-medium flex items-center gap-2 mb-2">Renda Mensal <Edit2 size={12}/></span><span className="text-3xl font-bold">{totalRenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></button>
        <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg relative"><span className="text-xs font-medium block mb-2">Total Gasto</span><h3 className="text-3xl font-bold">{totalGastoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative"><span className="text-xs font-medium block mb-2">Saldo Disponível</span><h3 className="text-3xl font-bold">{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
      </div>

      {/* CONTAS */}
      <div className="mt-4"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-700">Contas do Mês</h3><button onClick={() => setIsBillModalOpen(true)} className="flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Nova Conta</button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 text-blue-700 p-5 rounded-2xl border border-blue-100"><span className="text-xs font-bold uppercase">A Pagar</span><h3 className="text-2xl font-bold">R$ {totalContasPendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3></div>
            <div className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl border border-emerald-100"><span className="text-xs font-bold uppercase">Pagas</span><h3 className="text-2xl font-bold">{qtdContasPagas}</h3></div>
            <div className="bg-amber-50 text-amber-700 p-5 rounded-2xl border border-amber-100"><span className="text-xs font-bold uppercase">Pendentes</span><h3 className="text-2xl font-bold">{qtdContasPendentes}</h3></div>
        </div>
        <div className="space-y-3">{filteredBills.map(bill => (<div key={bill.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${bill.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}><Receipt size={20} /></div><div><h4 className="font-bold text-gray-800 text-sm">{bill.name} {bill.cardName ? `[${bill.cardName}]` : ''}</h4><div className="flex gap-2 text-xs text-gray-500 mt-1"><span>{formatDate(bill.dueDate)}</span><span>•</span><span className="font-medium text-gray-700">{bill.valueDisplay}</span></div></div></div><div className="flex gap-2">{bill.status === 'pending' && (<button onClick={() => updateBillStatus(bill.id, 'paid')} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><CheckCircle size={18} /></button>)}<button onClick={() => deleteBill(bill.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={18} /></button></div></div>))}</div>
      </div>

      {/* DISTRIBUIÇÃO */}
      <div className="mt-8 border-t border-gray-100 pt-8">
        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-700">Distribuição</h3><div className="flex gap-2"><button onClick={() => setIsTransportModalOpen(true)} className="flex items-center gap-2 text-sm font-medium bg-amber-100 text-amber-700 px-4 py-2 rounded-lg"><Bus size={18} /> Transporte</button><button onClick={() => setIsTransactionModalOpen(true)} className="flex items-center gap-2 text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"><Plus size={18} /> Novo Gasto</button></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesConfig.map((cat) => {
            const sumT = filteredTransactions.filter(t => t.category === cat.id).reduce((acc, curr) => acc + curr.amount, 0);
            const sumB = filteredBills.filter(b => mapBillToDistribution(b.category) === cat.id && b.status === 'paid').reduce((acc, curr) => acc + curr.valueRaw, 0);
            const total = sumT + sumB;
            const meta = (totalRenda * cat.metaPercent) / 100;
            const perc = meta > 0 ? (total / meta) * 100 : 0;
            const theme = { emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600', yellow: 'bg-yellow-50 text-yellow-600', violet: 'bg-violet-50 text-violet-600' }[cat.color];

            return (
              <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-4"><span className={`text-2xl p-3 rounded-xl ${theme}`}>{cat.emoji || '📦'}</span><div className="text-right"><span className="font-bold block">R$ {total.toLocaleString('pt-BR')}</span><span className="text-xs text-gray-400">{perc.toFixed(0)}% da meta</span></div></div>
                
                {/* AQUI ESTÁ A CORREÇÃO: "a definir" se meta for zero */}
                <div className="flex justify-between text-xs mb-2">
                    <b>{cat.label}</b>
                    <span className="text-gray-500">Meta: {meta > 0 ? meta.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}) : 'a definir'}</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4"><div className={`h-full rounded-full bg-${cat.color}-500`} style={{width: `${Math.min(perc, 100)}%`}}></div></div>
                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {bills.filter(b => mapBillToDistribution(b.category) === cat.id && b.status === 'paid').map(b => (<div key={`bill-${b.id}`} className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-50 pt-1"><span className="truncate w-24 flex items-center gap-1"><Receipt size={8}/> {b.name} {b.cardName ? `[${b.cardName}]` : ''}</span><div className="flex items-center gap-2"><span>{b.valueRaw.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></div></div>))}
                  {filteredTransactions.filter(t => t.category === cat.id).slice().reverse().map(t => (
                     <div key={`trans-${t.id}`} className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-50 pt-2 pb-1 hover:bg-gray-50 px-1 rounded">
                        <div className="flex flex-col"><span className="truncate w-32 font-medium text-gray-700">{t.description} {t.cardName ? `[${t.cardName}]` : ''}</span><span className="text-[9px] text-gray-400">{t.date}</span></div>
                        <div className="flex items-center gap-2"><span className="font-bold text-gray-600">{t.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span><button onClick={() => deleteTransaction(t.id)} className="text-gray-300 hover:text-red-600 p-1"><Trash2 size={14}/></button></div>
                     </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAIXINHAS */}
      <div className="mt-8 border-t border-gray-100 pt-8">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">Minhas Caixinhas 🎯</h3>
            <div className="flex gap-2">
                <button onClick={() => setIsDepositModalOpen(true)} className="text-sm font-medium bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">Depositar</button>
                <button onClick={() => setIsGoalModalOpen(true)} className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Nova</button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {goals.map(g => (
                <div key={g.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10"><div className="bg-violet-50 text-2xl w-12 h-12 flex items-center justify-center rounded-xl">{g.icon || '💰'}</div><button onClick={() => deleteGoal(g.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={16}/></button></div>
                    <h4 className="font-bold mb-1 relative z-10">{g.name}</h4><span className="text-2xl font-bold text-violet-600 relative z-10">{g.currentAmount.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</span>
                    <div className="absolute -right-4 -bottom-4 bg-violet-50 w-24 h-24 rounded-full opacity-50 z-0"></div>
                </div>
            ))}
        </div>
      </div>

      {/* MODAL DE NOVO GASTO */}
      {isTransactionModalOpen && (<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"><div className="flex justify-between mb-6"><h2 className="text-gray-900 font-bold text-xl">Novo Gasto</h2><button onClick={() => setIsTransactionModalOpen(false)}><X className="text-gray-500"/></button></div><form onSubmit={handleSubmitTransaction} className="space-y-4">
      <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none">{categoriesConfig.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
      <select value={form.paymentMethod} onChange={e => setForm({...form,paymentMethod:e.target.value, cardId: ''})} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none"><option value="Pix">Pix</option><option value="Cartão de Crédito">Cartão de Crédito</option><option value="Cartão de Débito">Cartão de Débito</option><option value="Dinheiro">Dinheiro</option></select>
      {form.paymentMethod === 'Cartão de Crédito' && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Qual Cartão?</label><select value={form.cardId} onChange={e => setForm({...form, cardId: e.target.value})} className="w-full p-2 rounded-lg border border-gray-200 bg-white outline-none"><option value="">Selecione...</option>{cards.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Parcelas</label><input type="number" min="1" max="24" value={form.installments} onChange={e=>setForm({...form,installments:e.target.value})} className="w-full p-2 rounded-lg border border-gray-200 bg-white outline-none"/></div>
          </div>
      )}
      <input placeholder="R$ 0,00" value={form.amountDisplay} onChange={e=>{const {raw,display}=formatCurrencyInput(e.target.value);setForm({...form,amountRaw:raw,amountDisplay:display})}} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none text-lg font-bold"/><input placeholder="Descrição" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none"/><button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-xl transition">Salvar Gasto</button></form></div></div>)}
      
      {/* MODAL DE NOVA CONTA */}
      {isBillModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg rounded-3xl p-6"><div className="flex justify-between mb-6"><h2 className="font-bold">Nova Conta</h2><button onClick={() => setIsBillModalOpen(false)}><X/></button></div><form onSubmit={handleCreateBill} className="grid grid-cols-2 gap-4"><input placeholder="Nome" value={billForm.name} onChange={e=>setBillForm({...billForm,name:e.target.value})} className="p-3 border rounded-xl"/><input placeholder="Valor" value={billForm.valueDisplay} onChange={e=>{const{raw,display}=formatCurrencyInput(e.target.value);setBillForm({...billForm,valueRaw:raw,valueDisplay:display})}} className="p-3 border rounded-xl"/><input type="date" value={billForm.dueDate} onChange={e=>setBillForm({...billForm,dueDate:e.target.value})} className="p-3 border rounded-xl"/>
      <select value={billForm.category} onChange={e=>setBillForm({...billForm,category:e.target.value, cardId: ''})} className="p-3 border rounded-xl"><option value="" disabled>Selecione</option><option value="Moradia">Moradia</option><option value="Transporte">Transporte</option><option value="Saúde">Saúde</option><option value="Educação">Educação</option><option value="Mercado">Mercado</option><option value="Estudos">Estudos</option><option value="Lazer">Lazer</option><option value="Beleza">Beleza</option><option value="Compras">Compras</option><option value="Streaming">Streaming</option><option value="iFood/Restaurante">iFood/Restaurante</option><option value="Despesas Eventuais">Despesas Eventuais</option><option value="Cartão de Crédito">Cartão de Crédito</option><option value="Empréstimo">Empréstimo</option><option value="Financiamento">Financiamento</option><option value="Outros">Outros</option></select>
      {billForm.category === 'Cartão de Crédito' && (<div className="col-span-2 animate-in fade-in slide-in-from-top-2"><label className="text-xs font-bold text-gray-500 uppercase ml-1">Qual Cartão?</label><select value={billForm.cardId} onChange={e => setBillForm({...billForm, cardId: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none"><option value="">Selecione o cartão...</option>{cards.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>)}
      <div className="col-span-2 flex gap-2"><input type="checkbox" checked={billForm.isRecurring} onChange={e=>setBillForm({...billForm,isRecurring:e.target.checked})}/><label className="">Recorrente (Mensal)</label></div><button className="col-span-2 bg-blue-600 text-white p-3 rounded-xl">Salvar</button></form></div></div>)}
      
      {/* MODAL DE RENDA */}
      {isIncomeModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl p-6"><div className="flex justify-between mb-6"><h2 className="font-bold">Rendas</h2><button onClick={() => setIsIncomeModalOpen(false)}><X/></button></div><div className="mb-6 bg-gray-50 p-4 rounded-2xl">
      <div className="mb-3"><label className="text-xs font-bold text-gray-500 uppercase ml-1">Tipo de Entrada</label><select value={incomeForm.type} onChange={e => setIncomeForm({...incomeForm, type: e.target.value})} className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none"><option value="Salário">💼 Salário</option><option value="Vale Transporte">🚌 Vale Transporte (VT)</option><option value="Vale Alimentação">🛒 Vale Alimentação (VA)</option><option value="Vale Refeição">🍽️ Vale Refeição (VR)</option><option value="Renda Extra">💰 Renda Extra</option><option value="Investimentos">📈 Rendimentos</option><option value="Outros">✨ Outros</option></select></div>
      <input placeholder="Descrição (Opcional)" value={incomeForm.name} onChange={e => setIncomeForm({...incomeForm, name: e.target.value})} className="w-full mb-2 p-3 rounded-xl border"/><div className="flex gap-2"><input placeholder="R$ 0,00" value={incomeForm.amountDisplay} onChange={e => {const {raw,display}=formatCurrencyInput(e.target.value);setIncomeForm({...incomeForm,amountRaw:raw,amountDisplay:display})}} className="w-32 p-3 rounded-xl border"/><button onClick={handleSubmitIncome} className="flex-1 bg-emerald-500 text-white rounded-xl">Add</button></div></div><div className="max-h-60 overflow-y-auto">{incomeList.map(i => (<div key={i.id} className="flex justify-between p-3 border-b"><span className="">{i.name}</span><div className="flex gap-2 font-bold text-emerald-600"><span>{i.amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span><button onClick={() => deleteIncome(i.id)} className="text-red-400"><Trash2 size={14}/></button></div></div>))}</div></div></div>)}
      
      {/* OUTROS MODAIS */}
      {isCardModalOpen && <CreditCardModal onClose={() => setIsCardModalOpen(false)} />}
      {isEmergencyModalOpen && <EmergencyModal onClose={() => setIsEmergencyModalOpen(false)} />}
      {isTelegramModalOpen && <TelegramModal onClose={() => setIsTelegramModalOpen(false)} />}
      {isTransportModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-3xl p-6"><div className="flex justify-between mb-6"><h2 className="font-bold">Transporte</h2><button onClick={() => setIsTransportModalOpen(false)}><X/></button></div><form onSubmit={handleCreateTransportExpense} className="space-y-4"><input placeholder="Valor Diário" value={transportForm.dailyCostDisplay} onChange={e=>{const{raw,display}=formatCurrencyInput(e.target.value);setTransportForm({...transportForm,dailyCostRaw:raw,dailyCostDisplay:display})}} className="w-full p-3 border rounded-xl"/><input placeholder="Dias" type="number" value={transportForm.days} onChange={e=>setTransportForm({...transportForm,days:e.target.value})} className="w-full p-3 border rounded-xl"/><button className="w-full bg-amber-500 text-white p-3 rounded-xl">Lançar</button></form></div></div>)}
      {isGoalModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-3xl p-6"><div className="flex justify-between mb-6"><h2 className="font-bold">Nova Caixinha</h2><button onClick={() => setIsGoalModalOpen(false)}><X/></button></div><form onSubmit={handleCreateGoal} className="space-y-4"><input placeholder="Nome" value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})} className="w-full p-3 border rounded-xl"/><input placeholder="Meta" value={goalForm.targetDisplay} onChange={e=>{const{raw,display}=formatCurrencyInput(e.target.value);setGoalForm({...goalForm,targetRaw:raw,targetDisplay:display})}} className="w-full p-3 border rounded-xl"/><button className="w-full bg-emerald-600 text-white p-3 rounded-xl">Criar</button></form></div></div>)}
      {isDepositModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-3xl p-6"><div className="flex justify-between mb-6"><h2 className="font-bold">Depositar</h2><button onClick={() => setIsDepositModalOpen(false)}><X/></button></div><form onSubmit={handleDepositSubmit} className="space-y-4"><select value={depositForm.goalId} onChange={e=>setDepositForm({...depositForm,goalId:e.target.value})} className="w-full p-3 border rounded-xl"><option value="">Selecione</option>{goals.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><input placeholder="Valor" value={depositForm.amountDisplay} onChange={e=>{const{raw,display}=formatCurrencyInput(e.target.value);setDepositForm({...depositForm,amountRaw:raw,amountDisplay:display})}} className="w-full p-3 border rounded-xl"/><button className="w-full bg-blue-600 text-white p-3 rounded-xl">Confirmar</button></form></div></div>)}
    </div>
  );
}