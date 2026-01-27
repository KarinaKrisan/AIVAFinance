import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X, Copy, Check, MessageCircle } from 'lucide-react';

export default function TelegramModal({ onClose }) {
  const { user } = useContext(FinanceContext);
  const [copied, setCopied] = useState(false);

  // O comando fixo (sem números aleatórios)
  const command = `/conectar ${user?.uid || '...'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl relative">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="text-blue-600" />
          Conectar Telegram
        </h2>

        {/* Área do Código */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
          <code className="font-mono text-sm font-bold text-gray-700 truncate mr-2">
            {command}
          </code>
          <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600">
            {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
          </button>
        </div>

        {/* Botão Abrir Telegram */}
        <a 
          href="https://t.me/AIVAFinanceBot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Abrir Bot no Telegram
        </a>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Copie o código acima e envie para o bot.
        </p>
      </div>
    </div>
  );
}
