import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, ShoppingCart, Truck, Wallet, LogOut, Package } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, onLogout }) => {
  const getRoleLabel = () => {
    switch (currentRole) {
      case UserRole.GUDANG: return 'Bagian Gudang';
      case UserRole.PEMBELIAN: return 'Bagian Pembelian';
      case UserRole.PIMPINAN: return 'Pimpinan';
      case UserRole.KEUANGAN: return 'Bagian Keuangan';
      default: return '';
    }
  };

  const getIcon = () => {
    switch (currentRole) {
      case UserRole.GUDANG: return <Package className="w-6 h-6" />;
      case UserRole.PEMBELIAN: return <ShoppingCart className="w-6 h-6" />;
      case UserRole.PIMPINAN: return <LayoutDashboard className="w-6 h-6" />;
      case UserRole.KEUANGAN: return <Wallet className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">ERP Sistem</span>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <p className="text-xs uppercase text-slate-400 font-semibold mb-2">Login Sebagai</p>
            <div className="flex items-center space-x-2 text-blue-400">
              {getIcon()}
              <span className="font-medium">{getRoleLabel()}</span>
            </div>
          </div>

          <nav className="space-y-2">
            <a href="#" className="block px-4 py-2 rounded-lg bg-slate-800 text-white font-medium">Dashboard</a>
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 mt-8"
            >
              <LogOut size={16} /> Keluar
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard {getRoleLabel()}</h1>
          <p className="text-slate-500 text-sm">Kelola aktivitas dan dokumen pembelian.</p>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
