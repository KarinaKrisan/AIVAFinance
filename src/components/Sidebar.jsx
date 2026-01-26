import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, Bell, LogOut, Wallet, User } from 'lucide-react';
import { FinanceContext } from '../context/FinanceContext';

export default function Sidebar() {
  const { logout, user } = useContext(FinanceContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full hidden md:flex">
      {/* CABEÇALHO DO USUÁRIO */}
      <div className="p-8 border-b border-gray-50">
        <div className="flex flex-col items-center text-center">
            {user?.photoURL ? (
                <img 
                    src={user.photoURL} 
                    alt="User" 
                    className="w-16 h-16 rounded-full border-4 border-emerald-50 mb-3 shadow-sm"
                />
            ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600">
                    <User size={32} />
                </div>
            )}
            <h3 className="font-bold text-gray-800 truncate w-full">{user?.displayName?.split(' ')[0]}</h3>
            <p className="text-xs text-gray-400 truncate w-full">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6">
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        
        <Link 
          to="/relatorios" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/relatorios') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <PieChart size={20} /> Relatórios
        </Link>

        <Link 
          to="/alertas" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/alertas') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Bell size={20} /> Alertas
        </Link>

        {/* Link para o Perfil */}
        <Link 
          to="/perfil" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/perfil') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <User size={20} /> Meu Perfil
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition font-medium"
        >
          <LogOut size={20} /> Sair
        </button>
      </div>
    </div>
  );
}