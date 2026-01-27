import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

export default function TelegramModal({ onClose }) {
  // 1. Pegamos o objeto 'user' para acessar o ID fixo (uid)
  const { user } = useContext(FinanceContext);
  const [copied, setCopied] = useState(false);

  // 2. Define o código como o UID do usuário. Se ainda estiver carregando, mostra aviso.
  const userCode = user?.uid || 'Carregando...';

  const handleCopy = () => {
    navigator.clipboard.writeText(`/conectar ${userCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Fundo Decorativo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Conectar AIVA</h2>
                    <p className="text-xs text-gray-500">Sua assistente financeira</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={20} className="text-gray-400" />
            </button>
        </div>

        {/* Passo a Passo */}
        <div className="space-y-6">
            
            {/* Passo 1: O Código */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase">1. Copie seu comando</label>
                <div 
                    onClick={handleCopy}
                    className="group relative bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-all"
                >
                    <div className="font-mono text-sm sm:text-lg text-gray-700 font-bold truncate mr-2">
                        {/* AQUI ESTÁ A MUDANÇA: Mostra o comando fixo */}
                        {`/conectar ${userCode}`}
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0">
                        {copied ? <Check size={20} className="text-emerald-500"/> : <Copy size={20}/>}
                    </div>
                    
                    {copied && (
                        <div className="absolute -top-8 right-0 bg-black text-white text-xs py-1 px-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
                            Copiado!
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400">Este é seu ID único. Não compartilhe com estranhos.</p>
            </div>

            {/* Passo 2: O Botão */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase">2. Inicie a AIVA no Telegram</label>
                <a 
                    href="https://t.me/AIVAFinanceBot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-1"
                >
                    <MessageCircle size={20} />
                    <MessageCircle size={20} />
                    Abrir @AIVAFinanceBot
                    <ExternalLink size={16} className="opacity-50" />
                </a>
            </div>

            {/* Instrução Final */}
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700 flex gap-3 items-start">
                <div className="mt-1">💡</div>
                <p>Ao abrir o Telegram, envie o comando copiado acima para o bot saber que é você.</p>
            </div>

        </div>
      </div>
    </div>
  );
}
