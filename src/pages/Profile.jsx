import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { User, Calendar, Phone, Mail, Save, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, userProfile, updateUserProfile } = useContext(FinanceContext);
  
  // Estado local do formulário
  const [formData, setFormData] = useState({
    displayName: '',
    birthDate: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // ESTADO DA NOTIFICAÇÃO (TOAST)
  const [showToast, setShowToast] = useState(false);

  // Carrega os dados do contexto para o formulário
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        birthDate: userProfile.birthDate || '',
        phone: userProfile.phone || ''
      });
    }
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Salva no Firebase
    await updateUserProfile(formData);
    
    setIsSaving(false);
    
    // MOSTRA A NOTIFICAÇÃO
    setShowToast(true);

    // ESCONDE AUTOMATICAMENTE APÓS 5 SEGUNDOS
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto relative">
      
      {/* --- NOTIFICAÇÃO FLUTUANTE (TOAST) --- */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-right duration-500">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-gray-700">
            <div className="bg-emerald-500 p-2 rounded-full text-white">
              <CheckCircle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Sucesso!</h4>
              <p className="text-xs text-gray-300">Perfil atualizado com sucesso.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-500 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          {/* Barra de progresso do tempo (Opcional, charme visual) */}
          <div className="h-1 bg-emerald-500 rounded-b-2xl mt-[-4px] animate-[width_5s_linear_forwards]" style={{width: '100%'}}></div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Capa e Foto */}
        <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500 relative"></div>
        <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
                <div className="rounded-full p-1.5 bg-white shadow-md">
                    <img 
                        src={user?.photoURL} 
                        alt="Perfil" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white"
                    />
                </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Nome */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
                    <div className="flex items-center gap-3 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <User size={18} className="text-gray-400" />
                        <input 
                            type="text" 
                            value={formData.displayName} 
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className="bg-transparent outline-none flex-1 text-gray-700 font-medium"
                        />
                    </div>
                </div>

                {/* Email (Apenas Leitura) */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
                    <div className="flex items-center gap-3 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed">
                        <Mail size={18} className="text-gray-400" />
                        <span className="text-gray-600">{user?.email}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Data de Nascimento</label>
                        <div className="flex items-center gap-3 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200 focus-within:border-emerald-500 transition">
                            <Calendar size={18} className="text-gray-400" />
                            <input 
                                type="date" 
                                value={formData.birthDate} 
                                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                                className="bg-transparent outline-none flex-1 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Celular / WhatsApp</label>
                        <div className="flex items-center gap-3 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-200 focus-within:border-emerald-500 transition">
                            <Phone size={18} className="text-gray-400" />
                            <input 
                                type="tel" 
                                placeholder="(00) 00000-0000"
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="bg-transparent outline-none flex-1 text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
                    >
                        {isSaving ? 'Salvando...' : <><Save size={20}/> Salvar Alterações</>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}