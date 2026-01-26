import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Wallet } from 'lucide-react';

export default function Login() {
  const { loginGoogle } = useContext(FinanceContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-700 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center animate-in zoom-in-95 duration-500">
        
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="text-emerald-600" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">AIVAFinance</h1>
        <p className="text-gray-500 mb-8">Seu controle financeiro inteligente e na nuvem.</p>

        <button 
          onClick={loginGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-xl transition shadow-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Entrar com Google
        </button>

        <p className="text-xs text-gray-400 mt-8">
          Seus dados salvos com segurança no Google Cloud.
        </p>
      </div>
    </div>
  );
}