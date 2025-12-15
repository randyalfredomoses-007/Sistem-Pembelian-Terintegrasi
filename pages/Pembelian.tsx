import React from 'react';
import { ProcurementRequest, DocStatus } from '../types';
import { ProcurementService } from '../services/mockDb';
import { StatusBadge } from '../components/StatusBadge';
import { FileText, Send } from 'lucide-react';

interface Props {
  data: ProcurementRequest[];
  refresh: () => void;
}

const Pembelian: React.FC<Props> = ({ data, refresh }) => {
  
  const handleVerify = (id: string) => {
    const supplier = prompt("Masukkan Nama Supplier yang dipilih untuk SDP:");
    if (supplier) {
      ProcurementService.verifySPP(id, supplier);
      refresh();
    }
  };

  const handleCreateSOP = (id: string) => {
    if(confirm("Buat Surat Order Pembelian (SOP) dan kirim ke Supplier?")) {
      ProcurementService.createSOP(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900">SPP Masuk</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {data.filter(r => r.status === DocStatus.SPP_CREATED).length}
            </p>
         </div>
         <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-bold text-indigo-900">Siap Order (SOP)</h3>
            <p className="text-2xl font-bold text-indigo-600 mt-2">
              {data.filter(r => r.status === DocStatus.APPROVED).length}
            </p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-700">Daftar Dokumen Pembelian</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Ref #</th>
              <th className="px-6 py-4">Status Saat Ini</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{req.sppNumber}</div>
                  {req.sdpNumber && <div className="text-xs text-slate-500">SDP: {req.sdpNumber}</div>}
                  {req.sopNumber && <div className="text-xs text-slate-500">SOP: {req.sopNumber}</div>}
                </td>
                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="text-xs">
                    {req.supplierName ? `Supplier: ${req.supplierName}` : '-'}
                  </div>
                  <div className="text-xs italic mt-1">
                    {req.items.length} items
                  </div>
                </td>
                <td className="px-6 py-4">
                  {req.status === DocStatus.SPP_CREATED && (
                    <button 
                      onClick={() => handleVerify(req.id)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 flex items-center gap-1"
                    >
                       Proses SDP
                    </button>
                  )}
                  {req.status === DocStatus.VERIFIED_BY_PURCHASING && (
                    <span className="text-xs text-slate-400 italic">Menunggu ACC Pimpinan</span>
                  )}
                  {req.status === DocStatus.APPROVED && (
                    <button 
                      onClick={() => handleCreateSOP(req.id)}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 flex items-center gap-1"
                    >
                       <Send size={12} /> Terbitkan SOP
                    </button>
                  )}
                  {req.status === DocStatus.ORDER_PLACED && (
                    <span className="text-xs text-teal-600 font-medium">Order Dikirim ke Supplier</span>
                  )}
                </td>
              </tr>
            ))}
             {data.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Tidak ada dokumen aktif.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pembelian;
