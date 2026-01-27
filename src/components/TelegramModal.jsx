import React, { useContext, useEffect, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { db } from '../firebase'; // Importa o banco de dados
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { X, Copy, Check, MessageCircle, ExternalLink, Loader2 } from 'lucide-react';

export default function TelegramModal({ onClose }) {
  const { user } = useContext(FinanceContext);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Função que busca ou cria o código fixo
  useEffect(() => {
    const getFixedCode = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          
          // Se já tem código, usa ele
          if (data.botCode) {
            setCode(data.botCode);
          } else {
            // Se não tem, gera um novo de 6 dígitos
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();
            await updateDoc(userRef, { botCode: newCode });
            setCode(newCode);
          }
        }
      } catch (error) {
        console.error("Erro ao gerar código:", error);
      } finally {
        setLoading(false);
      }
    };

    getFixedCode();
  }, [user]);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(`/conectar ${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Conectar AIVA</h2>
                    <p className="text-xs text-gray-500">Código de Acesso Fixo</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={20} className="text-gray-400" />
            </button>
        </div>

        {/* Corpo */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase">Seu Código Único (6 Dígitos)</label>
                
                <div 
                    onClick={handleCopy}
                    className="group relative bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-all h-20"
                >
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-400 w-full justify-center">
                            <Loader2 className="animate-spin" /> Gerando código...
                        </div>
                    ) : (
                        <>
                            <div className="font-mono text-2xl text-gray-800 font-bold tracking-widest">
                                {code || "Erro"}
                            </div>
                            <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                {copied ? <Check size={24} className="text-emerald-500"/> : <Copy size={24}/>}
                            </div>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-400">Este código é fixo e vinculado à sua conta.</p>
            </div>

            <a 
                href="https://t.me/AIVAFinanceBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition"
            >
                Abrir Telegram
            </a>
        </div>
      </div>
    </div>
  );
}
