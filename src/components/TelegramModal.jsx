import React, { useContext, useEffect, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { db } from '../firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { X, Copy, Check, MessageCircle, Loader2 } from 'lucide-react';

export default function TelegramModal({ onClose }) {
  const { user } = useContext(FinanceContext);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getFixedCode = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          // Se já tem código curto, mostra ele. Se não, cria um novo.
          if (data.botCode) {
            setCode(data.botCode);
          } else {
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();
            await updateDoc(userRef, { botCode: newCode });
            setCode(newCode);
          }
        }
      } catch (error) {
        console.error("Erro:", error);
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
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-400" />
        </button>

        <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <MessageCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Conectar Telegram</h2>
            <p className="text-gray-500">Use este código único para vincular sua conta</p>
        </div>

        <div onClick={handleCopy} className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-6 flex justify-between items-center cursor-pointer transition-all mb-6">
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 mx-auto"><Loader2 className="animate-spin"/> Carregando...</div>
            ) : (
                <>
                    <span className="font-mono text-3xl font-bold text-gray-800 tracking-widest">{code}</span>
                    <div className="text-gray-400">{copied ? <Check size={24} className="text-green-500"/> : <Copy size={24}/>}</div>
                </>
            )}
        </div>

        <a href="https://t.me/AIVAFinanceBot" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-center shadow-lg transition">
            Abrir Telegram
        </a>
      </div>
    </div>
  );
}
