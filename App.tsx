import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import Layout from './components/Layout';
import Gudang from './pages/Gudang';
import Pembelian from './pages/Pembelian';
import Pimpinan from './pages/Pimpinan';
import Keuangan from './pages/Keuangan';
import { ProcurementService } from './services/mockDb';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [data, setData] = useState(ProcurementService.getAll());

  // Simple poller or refresher to simulate live data updates between roles
  const refreshData = () => {
    setData([...ProcurementService.getAll()]);
  };

  useEffect(() => {
    refreshData();
  }, [currentRole]);

  // Login Screen
  if (!currentRole) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">ERP System</h1>
            <p className="text-slate-500">Sistem Pembelian Terintegrasi</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Pilih Login Akses</p>
            <button 
              onClick={() => setCurrentRole(UserRole.GUDANG)}
              className="w-full p-4 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-blue-700">Bagian Gudang</span>
              <span className="text-sm text-slate-500">Membuat SPP, Terima Barang (LPB)</span>
            </button>

            <button 
              onClick={() => setCurrentRole(UserRole.PEMBELIAN)}
              className="w-full p-4 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-blue-700">Bagian Pembelian</span>
              <span className="text-sm text-slate-500">Verifikasi SPP, Buat SDP & SOP</span>
            </button>

            <button 
              onClick={() => setCurrentRole(UserRole.PIMPINAN)}
              className="w-full p-4 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-blue-700">Pimpinan</span>
              <span className="text-sm text-slate-500">Persetujuan (ACC) SDP</span>
            </button>

            <button 
              onClick={() => setCurrentRole(UserRole.KEUANGAN)}
              className="w-full p-4 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-blue-700">Bagian Keuangan</span>
              <span className="text-sm text-slate-500">Pembayaran Faktur & LPT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Router
  const renderDashboard = () => {
    switch (currentRole) {
      case UserRole.GUDANG:
        return <Gudang data={data} refresh={refreshData} />;
      case UserRole.PEMBELIAN:
        return <Pembelian data={data} refresh={refreshData} />;
      case UserRole.PIMPINAN:
        return <Pimpinan data={data} refresh={refreshData} />;
      case UserRole.KEUANGAN:
        return <Keuangan data={data} refresh={refreshData} />;
      default:
        return null;
    }
  };

  return (
    <Layout currentRole={currentRole} onLogout={() => setCurrentRole(null)}>
      {renderDashboard()}
    </Layout>
  );
};

export default App;
